import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5174",
    trace: "on-first-retry"
  },
  webServer: process.env.START_SERVER
    ? {
        command: "pnpm dev --port 5174 --host",
        port: 5174,
        reuseExistingServer: false
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    }
  ]
});
