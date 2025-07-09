import { environment } from '../support/environment-utils';

describe('Specific location page', () => {
  it('should load the Domtoren location page with correct content', () => {
    cy.visit('/locaties/domtoren');
    cy.contains('de hoogste kerktoren van Nederland.');
    cy.contains('Iedere 50 jaar is er een grote restauratie nodig.');
  });

  it('should display organization logos', () => {
    cy.visit('/locaties/domtoren');
    cy.get('div.org-logo-hold').should('exist');
  });

  it('should display story card', () => {
    cy.visit('/locaties/domtoren');
    cy.get('div.story').should('exist');
  });

  it('should switch language to English and display translated content', () => {
    cy.visit('/locaties/domtoren');

    cy.get('app-lang-toggle a').eq(1).click();

    cy.contains('Every 50 years a major restoration is needed').should(
      'be.visible'
    );
  });

  it('should successfully fetch location details data from the API', () => {
    cy.intercept(
      'GET',
      environment.apiUrl + environment.apiSuffixes.locationDetailsById + '598'
    ).as('getLocationDetails');
    cy.visit('/locaties/domtoren');
    cy.wait('@getLocationDetails').its('response.statusCode').should('eq', 200);
  });
});
