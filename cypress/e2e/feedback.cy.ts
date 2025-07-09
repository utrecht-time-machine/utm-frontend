import { environment } from '../support/environment-utils';

describe('Feedback', () => {
  it('should submit feedback', () => {
    cy.intercept('POST', environment.commentPostUrl, (req) => {
      expect(req.body).to.deep.equal({
        itemId: '1069',
        comment: 'Automated test',
      });

      req.continue();
    }).as('submitFeedback');

    cy.visit('/locaties/domtoren?story=de-domtoren-een-waanzinnig-bouwproject');
    cy.get('app-story app-feedback textarea').type('Automated test');
    cy.get('app-story app-feedback button').click();

    cy.wait('@submitFeedback').its('response.statusCode').should('eq', 200);
    cy.contains('Bedankt voor je feedback').should('be.visible');
  });
});
