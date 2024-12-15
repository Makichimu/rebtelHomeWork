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
    get transactionsTable() {
        return cy.get('table');
    }
    get transactionsTableRows() {
        return cy.get('table > tbody > tr');
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
    clickTransactionTableButtonLeft() {
        cy.get(`button[ng-click="scrollTop()"]`).click();
    }
    
    clickTransactionTableButtonRight() {
        cy.get(`button[ng-click="scrollRight()"]`).click();
    }
    
    clickTransactionTableButtonReset() {
        cy.get(`button[ng-click="reset()"]`)
          .then($button => {
            if ($button.is(':visible')) {
              $button.click();
            } else {
              cy.log('Reset button is not visible, skipping click');
            }
          });
    }
    
    
    clickTransactionButtonBack() {
        cy.get(`button[ng-click="back()"]`).click();
    }
    
    sortTransactionTableByDate() {
        this.transactionsTable.find('thead > tr > td').eq(1).click();
    }

    resetTransactionHistory() {
        this.transactionsButton.click();
        this.clickTransactionTableButtonReset();
        this.clickTransactionButtonBack();
    }
    findTransaction(date, amount, type) {
        const transaction = `${date} ${amount} ${type}`;
        this.transactionsTableRows.contains(transaction).should('be.visible');
    }
    logout() {
        this.logoutButton.click();
    }

}

export default AccountPage;
