# Rebtel HomeWork

This repository contains the solution for Rebtel HomeWork using **Cypress** for end-to-end (E2E) testing. The tests automate workflows on a banking application, including adding new customers and opening accounts, as outlined in the test specifications.

## Project Structure

``` 
rebtelHomeWork
├── cypress
│   ├── fixtures
│   ├── pages
│   ├── reports
│   ├── support
│   ├── tests
│   │   └── e2e
│   └── utils
├── node_modules
├── cypress.config.jss
├── package-lock.json
├── package.json 
```


 - `cypress/`: Contains all Cypress-related files.
 - `fixtures/`: Contains test data files used by Cypress.
 - `pages/`: Contains page objects for the application under test.
 - `reports/`: Folder for storing test reports generated by Mochawesome.
 - `support/`: Support files for Cypress (e.g., custom commands).
 - `tests/e2e/`: Folder containing the end-to-end tests.
 - `utils/`: Utility functions used across tests.
 - `node_modules/`: Directory for installed Node.js dependencies.
 - `cypress.config.js`: Cypress configuration file.
 - `package.json`: Node.js package configuration file.
 - `package-lock.json`: Lock file for dependencies.

 ## Installation

To get started with this project, follow the steps below.

### 1. Clone the repository
```
git clone https://github.com/Makichimu/rebtelHomeWork.git
```

### 2. Install dependencies
```
npm install
```


### 3. Run the tests
```
npm test
```


### Cypress Configuration
The Cypress configuration is located in cypress.config.js. Key settings include:

- `Base URL`: The base URL for the application being tested is set to https://www.globalsqa.com/angularJs-protractor/BankingProject/#/.
- `Test Pattern`: The tests are located in the cypress/tests/e2e/ folder, and all .js, .jsx, .ts, and .tsx files are considered test files.
- `Reporter`: Cypress uses the Mochawesome reporter to generate HTML and JSON reports.
- `Report Directory`: Test results are stored in the cypress/reports folder.

### Test Suite Overview
The tests are organized in cypress/tests/e2e/ and use the Page Object Model to structure the tests.

#### Bank Manager Workflow Tests (bankManagerWorkflow.spec.js) 
These tests are organized into separate describe blocks:

#### Add New Customer

- Navigates to the Banking Project homepage and logs in as a Bank Manager.
- Uses a fixture (from customers.json) to add a new customer (only the first new customer is used, so if it needs we can pick any of them).
- Verifies that the customer appears in the customer list.

#### Open New Account

- Logs in as Bank Manager and selects an existing customer (using data from customers.json).
- Iterates over currencies (from currencies.json) to open an account for the customer in each currency.
- Validates that the account count for the customer increases as expected.


#### Customer Workflow Tests (customerWorkflow.spec.js)
These tests validate customer-specific scenarios:

#### Login as Customer
- Navigates to the homepage, logs in as a customer, and verifies the correct customer is selected.

#### Transaction Validation 
Separeted into Deposit and Withdrow describe blocks
- Performs deposit and withdrawal transactions on the customer account.
- Checks that the updated balance is displayed, and that transaction details (including amounts and types) are correctly recorded in localStorage and visible in the transaction table.

## Adding New Tests

If you need to test other pages or workflows, follow these steps:

1. **Create a new Page Object Model (POM)**:
   - Add a new file in the `cypress/pages` folder to represent the page you are testing (e.g., `AccountPage.js`).
   - Define methods for interacting with elements on that page (e.g., buttons, fields).

2. **Add the page to your tests**:
   - In your test file (inside `cypress/tests/e2e`), import the newly created page object.
   - Instantiate the page object and use its methods to perform actions in your tests.

## Working with utils and commands.js
### Utils
The utils folder contains helper functions that can be used across your tests. For example, utils/accountUtils.js includes functions to perform actions like depositing and withdrawing from accounts.

Some example functions:

- `getUserId`: Retrieves the user ID from localStorage based on the user's first and last name.
- `depositToAccount`: Deposits a specified amount into an account and returns the balance before and after the deposit.
- `withdrawFromAccount`: Withdraws a specified amount from an account and returns the balance before and after the withdrawal.
- `convertData`: Converts data from lockalStorage into TransactionTable format.

You can use these functions in your tests like so:
```
javascript
import { depositToAccount } from "../../utils/accountUtils";

describe('Deposit Workflow', function () {
    let accountPage = new AccountPage();

    it('Deposit to an account', function () {
        depositToAccount(accountPage, '12345', 500).then((result) => {
            expect(result.balanceAfter).to.eq(result.balanceBefore + result.depositAmount);
        });
    });
});
```

### Commands (commands.js)
The commands.js file in the cypress/support folder allows you to define custom Cypress commands that can be used in your tests.

For example, commands.js defines several custom commands:

- `loginAsManager`: Logs in as the manager.
- `loginAsCustomer`: Logs in as a customer by selecting their name from the list.
- `loadFixtures`: Loads fixtures (e.g., customers and currencies) for use in your tests.
You can use these commands like this:

```
javascript
describe('Login Tests', function () {
    it('Manager login', function () {
        cy.loginAsManager();
    });

    it('Customer login', function () {
        cy.loginAsCustomer('John Doe');
    });
});
```
To add more custom commands, simply define them in the commands.js file and use them in your tests.

## **CI/CD with GitHub Actions**

This project uses **GitHub Actions** for continuous integration. Cypress tests are automatically run on every `push` into main branch using a Cypress Docker image. The workflow configuration is in `.github/workflows/cypress.yml`.

### **Workflow Steps**
1. **Checkout Code**  
   The repository's code is cloned using [actions/checkout](https://github.com/actions/checkout).  
2. **Cache Dependencies**  
   [actions/cache](https://github.com/actions/cache) speeds up the process by caching `node_modules` using `package-lock.json` for the cache key.  
3. **Install Dependencies**  
   Dependencies are installed via `npm install`.  
4. **Run Tests**  
   Cypress tests are executed with Chrome using the `mochawesome` reporter. Reports are saved in `cypress/reports`.  
5. **Upload Test Results**  
   Test reports are uploaded as artifacts with [actions/upload-artifact](https://github.com/actions/upload-artifact).

### **GitHub Actions Workflow**
```
name: Cypress Tests

on: push

jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    container:
      image: cypress/browsers:node-22.11.0-chrome-130.0.6723.69-1-ff-132.0-edge-130.0.2849.56-1
      options: --user 1001  

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Cache npm dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-modules-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-modules-

      - name: Install dependencies
        run: npm install

      - name: Run Cypress tests
        run: npm run

      - name: Upload Cypress test results
        uses: actions/upload-artifact@v4
        with:
          name: cypress-reports
          path: cypress/reports
```

### Accessing Test Results
- Go to the Actions tab on GitHub.
- Select the latest workflow run.
- Download the cypress-reports artifact
