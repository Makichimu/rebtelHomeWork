import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/',
    specPattern: 'cypress/tests/e2e/**/*.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
    reporter: 'mochawesome', 
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
    },
  },
});
