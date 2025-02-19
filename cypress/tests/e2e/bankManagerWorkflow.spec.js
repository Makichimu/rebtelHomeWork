import ManagerPage from "../../pages/ManagerPage";

describe('Bank Manager Workflow Tests', function () {
  const managerPage = new ManagerPage();

  beforeEach(function () {
    cy.loginAsManager();
  });

  describe('Add New Customer', () => {
    it('should add a new customer successfully', function () {
      // Тестируем добавление только первого нового клиента
      const newCustomer = this.customers.newCustomers[0];
      const [firstName, lastName] = newCustomer.split(' ');
      const postCode = Math.floor(Math.random() * 10000) + "ES";

      cy.log(`Adding new customer: ${newCustomer}`);
      managerPage.addCustomerButton.click();
      managerPage.verifyAddCustomerFormElements();
      managerPage.addCustomer(firstName, lastName, postCode);
      managerPage.submitAddCustomerForm();
      managerPage.clickCustomers();
      managerPage.verifyCustomerInTable(firstName, lastName, postCode);
    });
  });

  describe('Open New Account', () => {
    it('should open a new account for the customer in selected currencies', function () {
      // Выбираем первого клиента из фикстуры для проверки открытия счета
      const customer = this.customers.customers[0];
      const [firstName, lastName] = customer.split(' ');
      cy.log(`Opening account for customer: ${customer}`);

      managerPage.clickCustomers();
      // Получаем текущее число счетов для клиента
      managerPage.getCustomerAccounts(firstName, lastName).then((initialAccounts) => {
        let currentCount = initialAccounts.length;
        // Перебираем все валюты из фикстуры
        this.currencies.currencies.forEach((currency) => {
          cy.log(`Creating account in currency: ${currency}`);
          managerPage.clickOpenAccount();
          managerPage.selectCustomer(customer);
          managerPage.selectCurrency(currency);
          managerPage.submitOpenAccountForm();
          managerPage.clickCustomers();
          managerPage.verifyCustomerAccountIncrement(firstName, lastName, currentCount);
          currentCount++;
        });
      });
    });
  });
});
