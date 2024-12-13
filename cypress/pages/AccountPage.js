class AccountPage {
    get accountHeading() {
        return cy.get('span.fontBig.ng-binding');
    }

    get accountSelect() {
        return cy.get('#accountSelect');
    }

    get accountNumber() {
        return cy.get('div.center > strong.ng-binding').first(); 
    }

    get balance() {
        return cy.get('div.center > strong.ng-binding').eq(1); 
    }

    get currency() {
        return cy.get('div.center > strong.ng-binding').last(); 
    }

    get transactionsButton() {
        return cy.contains('Transactions'); 
    }
    get depositButton() {
        return cy.contains('Deposit'); 
    }
    get submitDepositWithdrawButton() {
        return cy.get('button[type="submit"]');
    }

    get depositWithdrawAmount() {
        return cy.get('input[ng-model="amount"]');
    }

    get withdrawButton() {
        return cy.contains('Withdrawl'); 
    }

    get logoutButton() {
        return cy.get('button.btn.logout'); 
    }
    visit() {
        cy.visit('/account');
    }

    logout() {
        this.logoutButton.click();
    }

}

export default AccountPage;
