import { environment } from '../support/environment-utils';

describe('Routes page', () => {
  it('should load the routes page', () => {
    cy.visit('/routes');
  });

  it('should display a div with class card', () => {
    cy.visit('/routes');
    cy.get('div.card').should('exist');
  });

  it('should show Vollenhoven route on overview page', () => {
    cy.visit('/routes');
    cy.contains('Vollenhoven');
  });

  it('should successfully fetch routes data from the API', () => {
    cy.intercept('GET', environment.apiUrl + environment.apiSuffixes.routes).as(
      'getRoutes'
    );
    cy.visit('/routes');
    cy.wait('@getRoutes').its('response.statusCode').should('eq', 200);
  });
});
