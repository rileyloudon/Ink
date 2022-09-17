import { v4 as uuidv4 } from 'uuid';
import SignIn from '../fixtures/SignIn.json';

describe('User can upload, edit, and delete posts', () => {
  const { email, password, username } = SignIn;

  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
    cy.login(email, password);
  });

  beforeEach(() => {
    // reset to user page before each test
    cy.get('.profile-picture').click({ force: true });
    cy.get(`.user-dropdown > [href="#/${username}"]`).click({ force: true });
  });

  it('allows users to upload photos', () => {
    const uuid = uuidv4();

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
    cy.get('.spinner').should('not.exist');
    cy.reload();
    cy.get('.post').first().click();
    cy.get('.post-caption').should('contain.text', uuid);
    cy.get('.add-comment').should('not.exist');
  });

  it('allows users to edit their posts', () => {
    const newUuid = uuidv4();

    // Edit post
    cy.get('.post').first().click();
    cy.get('.post-dots').click();
    cy.get('.post-dropdown > a').click();
    cy.get('textarea').clear().type(newUuid);
    cy.get('.disable-comments [type="checkbox"]').uncheck({ force: true });
    cy.get('.save').click();
    cy.get('.spinner').should('not.exist');

    // Check edit worked
    cy.get('.profile-picture').click();
    cy.get(`.user-dropdown > [href="#/${username}"]`).click();
    cy.get('.post').first().click();
    cy.get('.post-caption').should('contain.text', newUuid);
    cy.get('.add-comment').should('exist');
  });

  it(`allows users to delete their posts and doesn't allow edits afterwards`, () => {
    // Delete post
    cy.get('.post').first().click();
    cy.get('.post-dots').click();
    cy.get('.post-dropdown > a').click();
    cy.get('.delete-post').click();
    cy.get('.delete').click();
    cy.get('.post-updated').should('contain.text', 'Post Deleted');

    // Blocks edits
    cy.get('#change-caption').type(' changed');
    cy.get('.disable-comments [type="checkbox"]').check({ force: true });
    cy.get('.hide-comments [type="checkbox"]').check({ force: true });
    cy.get('.post-updated').should('contain.text', 'Post Deleted');
    cy.get('.save').should('be.disabled');
  });
});
