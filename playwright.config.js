import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },
  reporter: "line",
  outputDir: "/tmp/myprofile-v3-playwright-results",
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
    reducedMotion: "no-preference",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /v3-firefox-controls\.spec\.js/,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        launchOptions: {
          args: [
            "--enable-webgl",
            "--enable-unsafe-swiftshader",
            "--ignore-gpu-blocklist",
            "--no-sandbox",
            "--use-angle=swiftshader",
          ],
        },
      },
    },
    {
      name: "firefox-controls",
      testMatch: /v3-firefox-controls\.spec\.js/,
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "webgl.disabled": false,
            "webgl.force-enabled": true,
          },
        },
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
