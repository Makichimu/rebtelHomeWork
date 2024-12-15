import AccountPage from "../pages/AccountPage";
import moment from "moment";

export const selectAllAccountsAndPerformAction = (action) => {
    const accountPage = new AccountPage();
    accountPage.accountSelect
        .find('option')
        .each(($option) => {
            const accountNumber = $option.text().trim();
            
            if (accountNumber) {
                cy.wrap($option).invoke('val').then((value) => {
                    accountPage.accountSelect.select(value);
                    action(accountNumber);
                });
            }
        });
};

export const getUserId = (firstName, lastName) => {
    return cy.window().then((win) => {
        const usersJSON = win.localStorage.getItem('User');
        const users = usersJSON ? JSON.parse(usersJSON) : {};
        const user = Object.values(users).find(user => user.fName === firstName && user.lName === lastName);
        return user ? user.id : null;
    });
};

export const depositToAccount = (accountPage, accountNumber, depositAmount) => {
    return cy.wrap(null).then(() => {
        accountPage.accountSelect.select(accountNumber);
        return accountPage.balance.invoke('text').then((balanceText) => {
            const balanceBefore = parseFloat(balanceText.trim());
            accountPage.depositButton.click();
            accountPage.depositWithdrawAmount.type(depositAmount);
            accountPage.submitDepositWithdrawButton.click();
            return accountPage.balance.invoke('text').then((balanceText) => {
                const balanceAfter = parseFloat(balanceText.trim());
                return {
                    balanceBefore,
                    balanceAfter,
                    depositAmount,
                };
            });
        });
    });
};


export const withdrawFromAccount = (accountPage, accountNumber, withdrawAmount) => {
    return cy.wrap(null).then(() => {
        accountPage.accountSelect.select(accountNumber);
        return accountPage.balance.invoke('text').then((balanceText) => {
            const balanceBefore = parseFloat(balanceText.trim());
            accountPage.withdrawButton.click();
            accountPage.depositWithdrawAmount.type(withdrawAmount);
            accountPage.submitDepositWithdrawButton.click();
            return accountPage.balance.invoke('text').then((newBalanceText) => {
                const balanceAfter = parseFloat(newBalanceText.trim());
                return {
                    balanceBefore,
                    balanceAfter,
                    withdrawAmount,
                    errorExpected: balanceBefore < withdrawAmount, 
                };
            });
        });
    });
};

export const convertData = (date) => {
    return moment(date).format('MMM D, YYYY h:mm:ss A');
};
