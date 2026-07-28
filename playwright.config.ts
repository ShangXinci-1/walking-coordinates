import { defineConfig } from "@playwright/test";

const viewports = [
  { name: "mobile-320", width: 320, height: 760 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 900 },
  { name: "desktop-1024", width: 1024, height: 900 },
  { name: "desktop-1440", width: 1440, height: 1000 },
];

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 10,
    },
  },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 5,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173/walking-coordinates/",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: viewports.map(({ name, width, height }) => ({
    name,
    use: { viewport: { width, height } },
  })),
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173/walking-coordinates/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
