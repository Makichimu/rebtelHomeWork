import LoginPage from "../pages/LoginPage";
import CustomerPage from "../pages/CustomerPage";


Cypress.Commands.add('loginAsManager', () => {
    const loginPage = new LoginPage();

    loginPage.visit();
    loginPage.verifyPageTitle();
    loginPage.loginAsManager();
});

Cypress.Commands.add('loginAsCustomer', (customerName) => {
    const loginPage = new LoginPage();
    const customerPage = new CustomerPage();

    loginPage.visit();
    loginPage.verifyPageTitle();
    loginPage.loginAsCustomer();
    customerPage.verifyCustomerListIsVisible();
    customerPage.selectCustomer(customerName);
    customerPage.verifySelectedCustomer(customerName);
    customerPage.loginAsSelectedCustomer();
});

Cypress.Commands.add('loadFixtures', () => {
    cy.fixture('customers').as('customers');
    cy.fixture('currencies').as('currencies');
  });