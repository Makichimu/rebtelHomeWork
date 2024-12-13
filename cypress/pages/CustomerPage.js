class CustomerPage {
    get customerList() {
        return cy.get('select#userSelect');
    }

    get loginButton() {
        return cy.get('button.btn.btn-default');
    }

    selectCustomer(customerName) {
        this.customerList.select(customerName);
    }

    loginAsSelectedCustomer() {
        this.loginButton.click();
    }

    verifyCustomerListIsVisible() {
        this.customerList.should('be.visible');
    }

    verifySelectedCustomer(customerName) {
        this.customerList.should('contain', customerName);
    }
}

export default CustomerPage;