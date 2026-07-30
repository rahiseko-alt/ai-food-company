#!/usr/bin/env python3
"""index.html + assets/ を1枚の自己完結HTMLに焼き固める。

外部通信ゼロで動くので、Artifact のように外部ホストを禁じられた場所でも、
ローカルでダブルクリックしただけ（file://）でも動く。

  python3 scripts/build-site-single.py -o dist/index.html
  python3 scripts/build-site-single.py -o dist/index.html --fonts-dir <woff2の置き場> --fonts-css <@font-faceのCSS>

--fonts-* を省略すると Google Fonts の <link> をそのまま残す（HTTP配信なら問題ない）。
指定すると @font-face を data URI で埋め込み、外部通信を完全に断つ。
"""
import argparse
import base64
import hashlib
import json
import mimetypes
import re
import sys
from pathlib import Path

# 配信対象は site/（Cloudflare Pages の Build output directory）。
ROOT = Path(__file__).resolve().parent.parent / "site"


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:%s;base64,%s' % (mime, base64.b64encode(path.read_bytes()).decode())


def safe_js(text: str) -> str:
    """インラインscriptの中で </script> がタグとして解釈されるのを防ぐ。"""
    return text.replace('</script', '<\\/script')


def build_lottie_payload(pc: Path, sp: Path) -> str:
    """PC/SP のアセットは実体が同一なので、内容ハッシュで1回だけ持つ。"""
    pool, out = {}, {}
    for key, path in (('PC', pc), ('SP', sp)):
        d = json.loads(path.read_text())
        amap = {}
        for a in d.get('assets', []):
            body = {k: v for k, v in a.items() if k != 'id'}
            h = hashlib.sha1(json.dumps(body, sort_keys=True).encode()).hexdigest()[:16]
            pool.setdefault(h, body)
            amap[a['id']] = h
        d.pop('assets', None)
        d['__map'] = amap
        out[key] = d

    j = lambda o: json.dumps(o, separators=(',', ':'), ensure_ascii=False)
    return (
        'window.__HERO_LOTTIE__=(function(){'
        'var POOL=%s,DATA={PC:%s,SP:%s};'
        'function build(d){'
        'var o={},k;for(k in d){if(k!=="__map")o[k]=d[k];}'
        'o.assets=Object.keys(d.__map).map(function(id){'
        'var a={id:id},s=POOL[d.__map[id]],p;for(p in s)a[p]=s[p];return a;});'
        'return o;}'
        'return{get:function(sp){return build(sp?DATA.SP:DATA.PC);}};'
        '})();'
    ) % (j(pool), j(out['PC']), j(out['SP']))


def build_fonts(fonts_css: Path, fonts_dir: Path, used: set | None) -> str:
    css = fonts_css.read_text()
    blocks = re.findall(r'@font-face\s*\{.*?\}', css, re.S)
    kept = []
    for b in blocks:
        m = re.search(r'url\("?([^")]+?)"?\)', b)
        if not m:
            continue
        name = m.group(1).split('/')[-1]
        if used is not None and name not in used:
            continue
        f = fonts_dir / name
        if not f.exists():
            continue
        kept.append(re.sub(r'url\("?[^")]+?"?\)', 'url(%s)' % data_uri(f), b))
    print('  フォント: %d / %d サブセットを埋め込み' % (len(kept), len(blocks)), file=sys.stderr)
    return '\n'.join(kept)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('-o', '--out', default='dist/index.html')
    ap.add_argument('--fonts-css')
    ap.add_argument('--fonts-dir')
    ap.add_argument('--fonts-used', help='埋め込むwoff2のファイル名を並べたJSON配列。省略すると全部')
    args = ap.parse_args()

    html = (ROOT / 'index.html').read_text()
    css = (ROOT / 'assets/css/site.css').read_text()
    site_js = '\n'.join((ROOT / 'assets/js' / f).read_text() for f in ('hero.js', 'contact.js'))

    # --- 画像を data URI に ---
    # 紙テクスチャはCSS内6箇所で使うので、data URI 本体は :root に1回だけ置く
    paper = data_uri(ROOT / 'assets/art/paper.png')
    n_paper = css.count("url('../art/paper.png')")
    css = css.replace("url('../art/paper.png')", 'var(--paper)')
    css = ':root { --paper: url(%s); }\n' % paper + css
    print('  紙テクスチャ: %d箇所を var(--paper) に集約' % n_paper, file=sys.stderr)

    greeting = data_uri(ROOT / 'assets/art/greeting-ink.png')
    html = html.replace('assets/art/greeting-ink.png', greeting)

    # --- <body> の中身だけを取り出し、外部参照を落とす ---
    body = html[html.index('<body>') + len('<body>'):html.index('</body>')]
    body = re.sub(r'\s*<script src="assets/js/[a-z-]+\.js"></script>', '', body)

    head_title = re.search(r'<title>(.*?)</title>', html).group(1)
    head_desc = re.search(r'<meta name="description" content="(.*?)"\s*/>', html, re.S).group(1)

    # --- フォント ---
    if args.fonts_css and args.fonts_dir:
        used = set(json.loads(Path(args.fonts_used).read_text())) if args.fonts_used else None
        font_css = build_fonts(Path(args.fonts_css), Path(args.fonts_dir), used)
        font_link = ''
    else:
        font_css = ''
        font_link = (
            '<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin" />\n'
            '<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700'
            '&amp;family=Zen+Kaku+Gothic+New:wght@500;700&amp;display=swap" rel="stylesheet" />'
        )

    vendor = '\n'.join(
        '<script>%s</script>' % safe_js((ROOT / 'assets/vendor' / f).read_text())
        for f in ('gsap.min.js', 'CustomEase.min.js', 'lottie.min.js')
    )
    payload = build_lottie_payload(ROOT / 'assets/lottie/hero.json', ROOT / 'assets/lottie/hero-sp.json')

    out = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{head_title}</title>
<meta name="description" content="{head_desc}" />
<link rel="icon" href="data:," />
{font_link}
<style>
{font_css}
{css}
</style>
{vendor}
</head>
<body>
{body}
<script>{safe_js(payload)}</script>
<script>{safe_js(site_js)}</script>
</body>
</html>
"""
    dest = Path(args.out)
    if not dest.is_absolute():
        dest = ROOT / dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out)
    print('  %s  %.2f MB' % (dest, len(out.encode()) / 1e6), file=sys.stderr)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
