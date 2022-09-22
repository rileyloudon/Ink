import SignIn from '../fixtures/SignIn.json';

describe('check various user interactions', () => {
  const { email, password } = SignIn;

  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
    cy.login(email, password);
  });

  beforeEach(() => {
    // reset to home page before each test
    cy.get('.ink').click({ force: true });
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

  it('allows users to like or unlike posts', () => {
    cy.get(
      ':nth-child(1) > .owner > .post-dropdown-container > .post-dots'
    ).click();
    cy.get('.post-dropdown > a').click();
    return cy.get('.icons > :nth-child(1)').then((post) => {
      const originalLikeStatus = post.hasClass('post-liked');

      // opposite
      cy.get('.icons > :nth-child(1)').click();
      cy.get('.icons > :nth-child(1)').should((likeStatus) => {
        expect(likeStatus.hasClass('post-liked')).not.equal(originalLikeStatus);
      });

      // original
      cy.get('.icons > :nth-child(1)').click();
      cy.get('.icons > :nth-child(1)').should((likeStatus) => {
        expect(likeStatus.hasClass('post-liked')).equal(originalLikeStatus);
      });
    });
  });
});
