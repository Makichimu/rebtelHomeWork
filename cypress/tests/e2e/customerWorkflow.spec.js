import CustomerPage from "../../pages/CustomerPage";
import AccountPage from "../../pages/AccountPage";
import {
  getUserId,
  depositToAccount,
  withdrawFromAccount,
  convertData
} from "../../utils/accountUtils";

describe('Customer Workflow Tests', function () {
  const customerPage = new CustomerPage();
  const accountPage = new AccountPage();

  describe('Customer Login', () => {
    it('should login as a customer successfully', function () {
      const customer = this.customers.customers[0];
      cy.log(`Logging in as customer: ${customer}`);
      cy.loginAsCustomer(customer);
      accountPage.accountHeading.should('have.text', customer);
      accountPage.logout();
      customerPage.verifyCustomerListIsVisible();
    });
  });

  describe('Deposit Transaction', () => {
    it('should add deposit to the account and verify transaction', function () {
      const customer = this.customers.customers[0];
      cy.log(`Testing deposit for customer: ${customer}`);
      cy.loginAsCustomer(customer);
      accountPage.resetTransactionHistory();

      const [firstName, lastName] = customer.split(' ');
      getUserId(firstName, lastName).then((userId) => {
        expect(userId).to.not.be.null;
        accountPage.accountHeading.should('have.text', customer);
        accountPage.accountSelect.find('option').first().then(($option) => {
          const accountNumber = $option.text().trim();
          cy.log(`Testing deposit for account: ${accountNumber}`);
          const depositAmount = 100;
          depositToAccount(accountPage, accountNumber, depositAmount).then(({ balanceBefore, balanceAfter }) => {
            expect(balanceAfter).to.equal(balanceBefore + depositAmount);
            cy.window().then((window) => {
              const transactionData = JSON.parse(window.localStorage.getItem('Transaction'));
              expect(transactionData).to.not.be.null;
              const userTransactions = transactionData[userId];
              expect(userTransactions).to.not.be.null;
              const accountTransactions = userTransactions[accountNumber];
              expect(accountTransactions.length).to.be.greaterThan(0);
              const lastTransaction = accountTransactions[accountTransactions.length - 1];
              expect(lastTransaction).to.deep.include({
                amount: depositAmount,
                type: 'Credit',
              });
              const lastTransactionDate = convertData(lastTransaction.date);

              cy.wait(1000);
              accountPage.transactionsButton.click();
              accountPage.sortTransactionTableByDate();
              accountPage.findTransaction(lastTransactionDate, depositAmount, 'Credit');
              accountPage.clickTransactionButtonBack();
            });
          });
        });
      });
    });
  });

  describe('Withdrawal Transaction', () => {
    it('should withdraw from the account and verify transaction', function () {
      const customer = this.customers.customers[0];
      cy.log(`Testing withdrawal for customer: ${customer}`);
      cy.loginAsCustomer(customer);

      const [firstName, lastName] = customer.split(' ');
      getUserId(firstName, lastName).then((userId) => {
        expect(userId).to.not.be.null;
        accountPage.accountHeading.should('have.text', customer);

        accountPage.accountSelect.find('option').first().then(($option) => {
          const accountNumber = $option.text().trim();
          cy.log(`Testing withdrawal for account: ${accountNumber}`);
          const withdrawAmount = 100;
          withdrawFromAccount(accountPage, accountNumber, withdrawAmount).then(({ balanceBefore, balanceAfter, errorExpected }) => {
            if (errorExpected) {
              cy.get('span.error').should('be.visible');
            } else {
              expect(balanceAfter).to.equal(balanceBefore - withdrawAmount);
              cy.window().then((window) => {
                const transactionData = JSON.parse(window.localStorage.getItem('Transaction'));
                expect(transactionData).to.not.be.null;
                const userTransactions = transactionData[userId];
                expect(userTransactions).to.not.be.null;
                const accountTransactions = userTransactions[accountNumber];
                expect(accountTransactions.length).to.be.greaterThan(0);
                const lastTransaction = accountTransactions[accountTransactions.length - 1];
                expect(lastTransaction).to.deep.include({
                  amount: withdrawAmount,
                  type: 'Debit',
                });
              });
            }
          });
        });
      });
    });
  });
});
