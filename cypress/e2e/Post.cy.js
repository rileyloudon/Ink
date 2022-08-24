import { v4 as uuidv4 } from 'uuid';
import SignIn from '../fixtures/SignIn.json';

describe('User can upload, edit, and delete posts', () => {
  const { email, password, username } = SignIn;

  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  it('allows users to upload photos', () => {
    const uuid = uuidv4();
    cy.login(email, password);

    cy.get('.add').click();
    cy.get('.dropzone').selectFile(
      { contents: 'cypress/fixtures/logo.png' },
      {
        action: 'drag-drop',
      }
    );
    cy.get('textarea').type(uuid);
    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('.form > button').click();
    cy.get('.profile-picture').click();
    cy.get(`.user-dropdown > [href="#/${username}"]`).click();
    cy.get('.post').first().click();
    cy.get('.post-caption').should('contain.text', uuid);
    cy.get('.add-comment').should('not.exist');
  });

  it('allows users to edit their posts', () => {
    // Edit post
    cy.get('.post-dots').click();
    cy.get('.post-dropdown > a').click();
    cy.get('textarea').clear().type('New Caption');
    cy.get('.disable-comments [type="checkbox"]').uncheck({ force: true });
    cy.get('.save').click();

    // Check edit worked
    cy.get('.profile-picture').click();
    cy.get(`.user-dropdown > [href="#/${username}"]`).click();
    cy.get('.post').first().click();
    cy.get('.post-caption').should('contain.text', 'New Caption');
    cy.get('.add-comment').should('exist');
  });

  it('allows users to delete their posts', () => {
    cy.get('.post-dots').click();
    cy.get('.post-dropdown > a').click();
    cy.get('.delete-post').click();
    cy.get('.delete').click();
    cy.get('.post-updated').should('contain.text', 'Post Deleted');
  });

  it(`doesn't allow saving on a deleted post`, () => {
    cy.get('#change-caption').type(' changed');
    cy.get('.disable-comments [type="checkbox"]').check({ force: true });
    cy.get('.hide-comments [type="checkbox"]').check({ force: true });
    cy.get('.post-updated').should('contain.text', 'Post Deleted');
    cy.get('.save').should('be.disabled');
  });
});
