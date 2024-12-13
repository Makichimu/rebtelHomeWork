class ManagerPage {
    get addCustomerButton() {
        return cy.get('button[ng-click="addCust()"]'); 
    }

    get openAccountButton() {
        return cy.get('button[ng-click="openAccount()"]'); 
    }

    get customersButton() {
        return cy.get('button[ng-click="showCust()"]');
    }

    get homeButton() {
        return cy.get('button.home'); 
    }

    get logoutButton() {
        return cy.get('button.logout'); 
    }

    get firstNameField() {
        return cy.get('input[ng-model="fName"]'); 
    }

    get lastNameField() {
        return cy.get('input[ng-model="lName"]'); 
    }

    get postCodeField() {
        return cy.get('input[ng-model="postCd"]'); 
    }

    get submitButton() {
        return cy.get('button[type="submit"]'); 
    }

    get userSelectDropdown() {
        return cy.get('#userSelect'); 
    }

    get currencyDropdown() {
        return cy.get('#currency'); 
    }

    get processButton() {
        return cy.get('button[type="submit"]'); 
    }

    get customersTable() {
        return cy.get('table'); 
    }

    get tableRows() {
        return this.customersTable.find('tbody tr'); 
    }

    visit() {
        cy.visit('/manager');
    }

    clickAddCustomer() {
        this.addCustomerButton.click(); 
    }

    clickOpenAccount() {
        this.openAccountButton.click(); 
    }

    clickCustomers() {
        this.customersButton.click(); 
    }

    clickHome() {
        this.homeButton.click(); 
    }

    logout() {
        this.logoutButton.click(); 
    }

    fillFirstName(firstName) {
        this.firstNameField.clear().type(firstName); 
    }

    fillLastName(lastName) {
        this.lastNameField.clear().type(lastName); 
    }

    fillPostCode(postCode) {
        this.postCodeField.clear().type(postCode);
    }

    submitAddCustomerForm() {
        this.submitButton.click(); 
    }

    addCustomer(firstName, lastName, postCode) {
        this.fillFirstName(firstName);
        this.fillLastName(lastName);
        this.fillPostCode(postCode);
        this.submitAddCustomerForm();
    }

    selectCustomer(customer) {
        this.userSelectDropdown.select(customer); 
    }

    selectCurrency(currency) {
        this.currencyDropdown.select(currency); 
    }

    submitOpenAccountForm() {
        this.processButton.click();
    }

    openAccountForCustomer(customerId, currency) {
        this.selectCustomer(customerId); 
        this.selectCurrency(currency); 
        this.submitOpenAccountForm(); 
    }

    getCustomerRowByName(firstName, lastName) {
        return this.tableRows.contains(`${firstName} ${lastName}`); 
    }

    getCustomerAccounts(firstName, lastName) {
        return this.getCustomerRowByName(firstName, lastName)
            .find('td:nth-child(4)')
            .invoke('text')
            .then((accountNumbers) => accountNumbers.trim().split(/\s+/).filter(Boolean));
    }

    verifyCustomerAccountIncrement(firstName, lastName, initialCount) {
        this.getCustomerAccounts(firstName, lastName).then((accounts) => {
            cy.log(`Accounts for ${firstName} ${lastName}:`, accounts);
            expect(accounts.length).to.equal(initialCount + 1);
        });
    }

    verifyCustomerInTable(firstName, lastName, postCode) {
        this.tableRows
            .should('contain', firstName)
            .and('contain', lastName)
            .and('contain', postCode); 
    }

    verifyAddCustomerFormElements() {
        this.firstNameField.should('be.visible');
        this.lastNameField.should('be.visible');
        this.postCodeField.should('be.visible');
        this.submitButton.should('be.visible');
    }

    verifyPageElements() {
        this.addCustomerButton.should('be.visible');
        this.openAccountButton.should('be.visible');
        this.customersButton.should('be.visible');
        this.homeButton.should('be.visible');
    }
}

export default ManagerPage;
