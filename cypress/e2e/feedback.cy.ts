import { environment } from '../support/environment-utils';

describe('Feedback', () => {
  it('should submit feedback for story', () => {
    cy.intercept('POST', environment.commentPostUrl, (req) => {
      req.headers['isTestMessage'] = 'true';
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

  it('should submit feedback for location', () => {
    cy.intercept('POST', environment.commentPostUrl, (req) => {
      req.headers['isTestMessage'] = 'true';
      expect(req.body).to.deep.equal({
        itemId: '598',
        comment: 'Automated test for location',
      });
      req.continue();
    }).as('submitFeedback');
    cy.visit('/locaties/domtoren');
    cy.get('app-selected-item app-feedback textarea').type(
      'Automated test for location'
    );
    cy.get('app-selected-item app-feedback button').click();
    cy.wait('@submitFeedback').its('response.statusCode').should('eq', 200);
    cy.contains('Bedankt voor je feedback').should('be.visible');
  });
});
