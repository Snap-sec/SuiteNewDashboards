/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
//require('dotenv').config();
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.{js,ts}', //By default, Playwright runs all tests in the testDir. If you want to limit the test files it picks up (e.g., only .spec.js or .spec.ts files), you can add a testMatch pattern.
  timeout: 30000,
  retries: 0,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth/*.setup.js',
    },
    // ==================== MAIN MODULE TESTS ====================
    {
      name: 'e2e vm tests',
      testMatch: '**/vm/**/*.spec.js', // ✅ Matches all tests inside vm subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },

    {
      name: 'e2e aim tests',
      testMatch: '**/aim/**/*.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e asm tests',
      testMatch: '**/asm/**/*.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e auth & account tests',
      testMatch: '**/auth/**/*.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e vs tests',
      testMatch: '**/vs/**/*.spec.js', // ✅ Matches all tests inside vs subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e was tests',
      testMatch: '**/was/**/*.spec.js', // ✅ Matches all tests inside was subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e cspm tests',
      testMatch: '**/{cspm,csm}/**/*.spec.js', // ✅ Matches all tests inside cspm/csm subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e sca tests',
      testMatch: '**/sca/**/*.spec.js', // ✅ Matches all tests inside sca subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e sast tests',
      testMatch: '**/sast/**/*.spec.js', // ✅ Matches all tests inside sast subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'e2e agent fleet tests',
      testMatch: '**/agent fleet/**/*.spec.js', // ✅ Matches all tests inside agent fleet subfolders
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },

    // ==================== VM VULNERABILITY FILTER TESTS ====================
    {
      name: 'vm vulnerabilities severity filter',
      testMatch: '**/vm/pages/vulnerabilities/filters/severity.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'vm vulnerabilities state filter',
      testMatch: '**/vm/pages/vulnerabilities/filters/state.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'vm vulnerabilities assessments filter',
      testMatch: '**/vm/pages/vulnerabilities/filters/assessments.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },

    // ==================== VM ASSETS FILTER TESTS ====================
    {
      name: 'vm assets type filter',
      testMatch: '**/vm/pages/assets/filters/type.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },

    // ==================== VM CHANGE REQUESTS FILTER TESTS ====================
    {
      name: 'vm change-requests priority filter',
      testMatch:
        '**/vm/pages/change-management/change-requests/filters/priority.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'vm change-requests state filter',
      testMatch:
        '**/vm/pages/change-management/change-requests/filters/state.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },

    // ==================== ASM FILTER TESTS ====================
    {
      name: 'asm subdomains exposure filter',
      testMatch:
        '**/asm/pages/attack-surface/subdomains/filters/exposure.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'asm subdomains waf filter',
      testMatch: '**/asm/pages/attack-surface/subdomains/filters/waf.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    {
      name: 'asm certificates status filter',
      testMatch:
        '**/asm/pages/attack-surface/certificates/filters/status.spec.js',
      dependencies: ['setup'],
      use: { storageState: STORAGE_STATE },
    },
    // {
    //   name: 'Chromium',
    //   use: { browserName: 'chromium' },
    //   viewport: { width: 1280, height: 720 },
    // },
    // {
    //   name: 'Firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'WebKit',
    //   use: { browserName: 'webkit' },
    // },
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
  outputDir: './tests/reports/results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './tests/reports/html', open: 'never' }],
    ['json', { outputFile: './tests/reports/test-results.json' }],
  ],
});
