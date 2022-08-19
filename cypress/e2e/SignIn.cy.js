import SignIn from '../fixtures/SignIn.json';

describe('Both user and guest sign ins work', () => {
  before(() => {
    cy.visit('http://localhost:3000/ink/');
  });

  it('Guest sign in works', () => {
    cy.get('.guest-btn').click();
    cy.get('.profile-picture').click();
    cy.get('[href="#/guest"]').click();
    cy.get('.username').should('contain.text', 'guest');
  });

  it('Log out redirects to sign in', () => {
    cy.get('.profile-picture').click();
    cy.get('.sign-out > button').click();
    cy.location('hash').should('eq', '#/');
  });

  it('User sign in works', () => {
    // This test will fail without an account saved in fixtures
    // create 'fixtures' folder -> create SignIn.json -> add email, password, and username of an account to test
    cy.get('.username').type(SignIn.email);
    cy.get('[type="password"]').type(SignIn.password);
    cy.get('.sign-in-btn').click();
    cy.get('.profile-picture').click();
    cy.get(`[href="#/${SignIn.username}"]`).click();
    cy.get('.username').should('contain.text', SignIn.username);
  });
});
