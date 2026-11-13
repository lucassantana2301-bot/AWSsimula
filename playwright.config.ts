import { defineConfig } from "@playwright/test";

/* Usa o Chrome do sistema (CI e máquina local) em vez de baixar navegadores. */
const chrome = process.env["CHROME_PATH"] ?? "/usr/bin/google-chrome";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: process.env["CI"] ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL: "http://localhost:4174",
    launchOptions: { executablePath: chrome, args: ["--no-sandbox", "--disable-dev-shm-usage"] },
    serviceWorkers: "block",
  },
  projects: [
    { name: "celular", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: "npx vite preview --port 4174 --strictPort",
    url: "http://localhost:4174",
    reuseExistingServer: !process.env["CI"],
    timeout: 30_000,
  },
});
