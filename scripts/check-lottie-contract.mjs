import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const lottieDirectory = path.join(
  repositoryRoot,
  "site",
  "assets",
  "lottie",
);

const mobileLayerContracts = [
  {
    name: "final-brush-text-artwork",
    position: [208.452, 444.781, 0],
  },
  {
    name: "final-brush-text-composite",
    position: [193, 432, 0],
  },
];

async function readAnimation(fileName) {
  const filePath = path.join(lottieDirectory, fileName);
  let animation;

  try {
    animation = JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${fileName} is not valid JSON`, { cause: error });
  }

  assert.equal(
    typeof animation,
    "object",
    `${fileName} must contain a Lottie object`,
  );
  assert.ok(
    Array.isArray(animation.layers) && animation.layers.length > 0,
    `${fileName} must contain top-level layers`,
  );
  assert.ok(
    Number.isFinite(animation.fr) && animation.fr > 0,
    `${fileName} must have a positive frame rate`,
  );
  assert.ok(
    Number.isFinite(animation.w) && Number.isFinite(animation.h),
    `${fileName} must have numeric dimensions`,
  );

  return animation;
}

function assertStaticPosition(layer, label, expectedPosition) {
  const position = layer?.ks?.p;

  assert.ok(position, `${label} must have a position transform`);
  assert.equal(position.a, 0, `${label} position must be static`);
  assert.ok(
    Array.isArray(position.k) &&
      position.k.length >= 3 &&
      position.k.slice(0, 3).every(Number.isFinite),
    `${label} must have a numeric position vector`,
  );
  if (expectedPosition) {
    assert.deepEqual(
      position.k,
      expectedPosition,
      `${label} position must remain ${JSON.stringify(expectedPosition)}`,
    );
  }
}

function findLatestStartingLayer(animation, type) {
  return animation.layers
    .filter((layer) => layer.ty === type && Number.isFinite(layer.ip))
    .sort((left, right) => right.ip - left.ip)[0];
}

const mobileAnimation = await readAnimation("hero-sp.json");

for (const contract of mobileLayerContracts) {
  const matches = mobileAnimation.layers.filter(
    (layer) => layer.nm === contract.name,
  );

  assert.equal(
    matches.length,
    1,
    `hero-sp.json must contain exactly one ${contract.name} layer`,
  );
  assertStaticPosition(
    matches[0],
    `hero-sp.json ${contract.name}`,
    contract.position,
  );
}

const desktopAnimation = await readAnimation("hero.json");
const desktopFinalArtwork = findLatestStartingLayer(desktopAnimation, 2);
const desktopFinalComposite = findLatestStartingLayer(desktopAnimation, 0);

assert.ok(
  desktopFinalArtwork,
  "hero.json must contain an identifiable final artwork layer",
);
assert.ok(
  desktopFinalComposite,
  "hero.json must contain an identifiable final composite layer",
);
assertStaticPosition(
  desktopFinalArtwork,
  "hero.json final artwork",
);
assertStaticPosition(
  desktopFinalComposite,
  "hero.json final composite",
);

console.log(
  "Lottie contract OK: mobile final brush text is fixed and desktop final layers are static.",
);
