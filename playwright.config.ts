import { defineConfig, devices } from "@playwright/test";

/*
 * Chrome do sistema (CI e máquina local) para as suítes principais, sem baixar navegador.
 * Firefox e WebKit (item 15) rodam o fluxo do simulado quando PW_TODOS=1; no CI eles são
 * instalados com `npx playwright install --with-deps firefox webkit`.
 */
const chrome = process.env["CHROME_PATH"] || "/usr/bin/google-chrome";
const chromium = { launchOptions: { executablePath: chrome, args: ["--no-sandbox", "--disable-dev-shm-usage"] } };
const todos = process.env["PW_TODOS"] === "1";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: process.env["CI"] ? [["github"], ["list"], ["html", { open: "never", outputFolder: "playwright-report" }]] : [["list"]],
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}",
  expect: { toHaveScreenshot: { threshold: 0.2 } },
  use: {
    baseURL: "http://localhost:4174",
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "celular",
      testIgnore: /visual\.spec/,
      use: { ...chromium, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    { name: "desktop", testIgnore: /visual\.spec/, use: { ...chromium, viewport: { width: 1280, height: 900 } } },
    { name: "visual", testMatch: /visual\.spec/, use: { ...chromium } },
    ...(todos
      ? [
          { name: "firefox", testMatch: /simulado\.spec/, use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", testMatch: /simulado\.spec/, use: { ...devices["Desktop Safari"] } },
        ]
      : []),
  ],
  webServer: {
    command: "npx vite preview --port 4174 --strictPort",
    url: "http://localhost:4174",
    reuseExistingServer: !process.env["CI"],
    timeout: 30_000,
  },
});
