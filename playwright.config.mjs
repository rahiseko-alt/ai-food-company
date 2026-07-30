import { defineConfig } from "@playwright/test";

const viewports = [
  ["mobile-320", { width: 320, height: 568 }],
  ["mobile-390", { width: 390, height: 844 }],
  ["tablet-768", { width: 768, height: 1024 }],
  ["desktop-1024", { width: 1024, height: 768 }],
  ["desktop-1440", { width: 1440, height: 900 }],
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    locale: "ja-JP",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: viewports.map(([name, viewport]) => ({
    name,
    use: { viewport },
  })),
  webServer: {
    command: "pnpm run dev",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
