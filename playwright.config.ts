import { defineConfig, devices } from '@playwright/test'
import { minutesToMilliseconds, secondsToMilliseconds } from 'date-fns'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv'
// dotenv.config({ path: path.resolve(__dirname, '.env') })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './integration_tests',
  /* Maximum time one test can run for. */
  timeout: minutesToMilliseconds(3),
  /* Maximum time test suite can run for. */
  globalTimeout: minutesToMilliseconds(60),
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: secondsToMilliseconds(30),
    timezoneId: 'Europe/London',
    launchOptions: { slowMo: 150 },
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'off' : 'on',
    ...devices['Desktop Chrome'],
    testIdAttribute: 'data-qa',
  },

  /* Configure projects */
  projects: [{ name: 'default' }],
})