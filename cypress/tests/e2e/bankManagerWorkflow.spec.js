import ManagerPage from "../../pages/ManagerPage";

describe('Bank Manager Workflow Tests', function () {
    let managerPage = new ManagerPage();
    this.beforeEach(() => {
        cy.loginAsManager();
    });

    it('Add new customer', function () {
        this.customers.newCustomers.forEach((customer) => {
            cy.log(`Testing customer: ${customer}`);
            managerPage.addCustomerButton.click();
            managerPage.verifyAddCustomerFormElements();
            const [firstName, lastName] = customer.split(' ');
            const postCode = (Math.floor(Math.random() * 10000) + "ES");
            managerPage.addCustomer(firstName, lastName, postCode);
            managerPage.submitAddCustomerForm();
            managerPage.clickCustomers();
            managerPage.verifyCustomerInTable(firstName, lastName, postCode);
        });
    });

    it('Open new account', function () {
        this.customers.customers.forEach((customer) => {
            const [firstName, lastName] = customer.split(' ');
            cy.log(`Opening accounts for customer: ${firstName} ${lastName}`);
            managerPage.clickCustomers();
            managerPage.getCustomerAccounts(firstName, lastName).then((initialAccounts) => {
                let currentCount = initialAccounts.length;
                this.currencies.currencies.forEach((currency) => {
                    cy.log(`Creating account in currency: ${currency}`);
                    managerPage.clickOpenAccount();
                    managerPage.selectCustomer(`${firstName} ${lastName}`);
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
