import SignIn from '../fixtures/SignIn.json';

describe('Both user and guest sign ins work', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  it('Guest sign in works', () => {
    cy.get('.guest-btn').click();
    cy.get('.profile-picture').click();
    cy.get('.user-dropdown > [href="#/guest"]').click();
    cy.get('.username').should('contain.text', 'guest');
  });

  it('Log out redirects to sign in', () => {
    cy.get('.profile-picture').click();
    cy.get('.sign-out > button').click();
    cy.location('hash').should('eq', '#/');
  });

  it('User sign in works', () => {
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
