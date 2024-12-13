import CustomerPage from "../../pages/CustomerPage";
import AccountPage from "../../pages/AccountPage";
import { selectAllAccountsAndPerformAction, withdrawFromAccount, getUserId, depositToAccount } from "../../utils/accountUtils";

describe ('Customer Workflow Tests', () => {
    let customerPage = new CustomerPage();
    let accountPage = new AccountPage();
    
    it ('Login by each customer', function() {
        this.customers.customers.forEach((customer) => {
            cy.log('Testing customer:', customer);
            cy.loginAsCustomer(customer);
            accountPage.accountHeading.should('have.text', customer);
            accountPage.logout();
            customerPage.verifyCustomerListIsVisible();
        });
    });

    it('Add deposit to each account for each customer', function() {
        this.customers.customers.forEach((customer) => {
            cy.loginAsCustomer(customer);
            const [firstName, lastName] = customer.split(' ');
            getUserId(firstName, lastName).then((userId) => {
                cy.wrap(userId).should('not.be.null');
                accountPage.accountHeading.should('have.text', customer);
                selectAllAccountsAndPerformAction(accountPage.accountSelect, (accountNumber) => {
                    cy.log('Testing account:', accountNumber);
                    const depositAmount = 100;
                    depositToAccount(accountPage, accountNumber, depositAmount).then(({ balanceBefore, balanceAfter }) => {
                        cy.wrap(balanceAfter).should('equal', balanceBefore + depositAmount);

                        cy.window().then((window) => {

                            const transactionData = JSON.parse(window.localStorage.getItem('Transaction'));
                            cy.wrap(transactionData).should('not.be.null');

                            const userTransactions = transactionData[userId];
                            cy.wrap(userTransactions).should('not.be.null');

                            const accountTransactions = userTransactions[accountNumber];
                            cy.wrap(accountTransactions).should('have.length.greaterThan', 0);

                            const lastTransaction = accountTransactions[accountTransactions.length - 1];

                            cy.wrap(lastTransaction).should('deep.include', {
                                amount: depositAmount,
                                type: 'Credit',
                            }); 
                        });
                    });
                });
            });
        });
    });
    

    it('Withdraw from each account', function () {
        this.customers.customers.forEach((customer) => {
            cy.log('Testing customer:', customer);
            cy.loginAsCustomer(customer);
            const [firstName, lastName] = customer.split(' ');
            getUserId(firstName, lastName).then((userId) => {
                cy.log('User ID:', userId);
                expect(userId).to.not.be.null;
                accountPage.accountHeading.should('have.text', customer);
                selectAllAccountsAndPerformAction(accountPage.accountSelect, (accountNumber) => {
                    const withdrawAmount = 100;
                    withdrawFromAccount(accountPage, accountNumber, withdrawAmount).then(({ balanceBefore, balanceAfter, withdrawAmount, errorExpected }) => {
                        if (errorExpected) {
                            cy.get('span.error').should('be.visible');
                        } else {
                            expect(balanceAfter).to.equal(balanceBefore - withdrawAmount);
                            cy.window().then((window) => {
                                const transactionData = JSON.parse(window.localStorage.getItem('Transaction'));
                                cy.wrap(transactionData).should('not.be.null');
    
                                const userTransactions = transactionData[userId];
                                cy.wrap(userTransactions).should('not.be.null');
    
                                const accountTransactions = userTransactions[accountNumber];
                                cy.wrap(accountTransactions).should('have.length.greaterThan', 0);
    
                                const lastTransaction = accountTransactions[accountTransactions.length - 1];
                                cy.wrap(lastTransaction).should('deep.include', {
                                    amount: withdrawAmount,
                                    type: 'Debit',
                                });
                            });
                        };
                    });
                });
            });
        });
    });
});
