import SignIn from '../fixtures/SignIn.json';

describe('check various user interactions', () => {
  const { email, password } = SignIn;

  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
    cy.login(email, password);
  });

  it('allows users to search and follow or unfollow other users', () => {
    // search with uppercase and lowercase
    cy.get('.search-box').type('RILeY');
    cy.get('.search-item[href="#/riley"').should('exist');
    cy.get('.search-item[href="#/riley"]').click();
    return cy.get('.top > button').then((button) => {
      const originalButtonText = button.text();

      // switch to opposite value
      cy.get('.top > button').click();
      cy.get('.spinner').should('not.exist');
      cy.get('.top > button').should((button2) => {
        expect(button2.text()).not.equal(originalButtonText);
      });

      // switch back to original value
      cy.get('.top > button').click();
      cy.get('.spinner').should('not.exist');
      cy.get('.top > button').should((button2) => {
        expect(button2.text()).equal(originalButtonText);
      });
    });
  });
});
