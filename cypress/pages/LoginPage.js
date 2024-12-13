class LoginPage {

    visit() {
        cy.visit('/login');
    }
    get customerLoginButton(){
        return cy.get('button[ng-click="customer()"]');
    }

    get managerLoginButton(){
        return cy.get('button[ng-click="manager()"]');
    }

    get mainHeading(){
        return cy.get('strong.mainHeading');
    }

    get homeButton(){
        return cy.get('button.home');
    }
    
    loginAsManager(){
        this.managerLoginButton.click();
    }

    loginAsCustomer(){
        this.customerLoginButton.click();
    }

    verifyPageTitle(){
        this.mainHeading.should('have.text', 'XYZ Bank');
    }
}

export default LoginPage;