import SignIn from '../fixtures/SignIn.json';

describe('Users and guests can sign in', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  it('allows guests to sign in and redirects to sign in page on logout', () => {
    // Guest log in
    cy.get('.guest-btn').click();
    cy.get('.profile-picture').click();
    cy.get('.user-dropdown > [href="#/guest"]').click();
    cy.get('.username').should('contain.text', 'guest');

    // Log out - test redirect
    cy.get('.profile-picture').click();
    cy.get('.sign-out > button').click();
    cy.location('hash').should('eq', '#/');
  });

  it('allows users to sign in', () => {
    const { email, password, username } = SignIn;
    // This test will fail without an account saved in fixtures
    // in 'cypress' folder, create 'fixtures' folder -> create SignIn.json -> add email, password, and username of an account to test
    cy.get('.username').type(email);
    cy.get('[type="password"]').type(password);
    cy.get('.sign-in-btn').click();
    cy.get('.profile-picture').click();
    cy.get(`.user-dropdown > [href="#/${username}"]`).click();
    cy.get('.username').should('contain.text', username);
  });
});
