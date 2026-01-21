import { environment } from '../support/environment-utils';

describe('Location page', () => {
  it('should load the location page', () => {
    cy.visit('/locaties');
  });

  it('should display a card for a location nearby', () => {
    cy.visit('/locaties');
    cy.get('div.card').should('exist');
  });

  // it('should successfully fetch locations data from the API', () => {
  //   cy.intercept(
  //     'GET',
  //     environment.apiUrl + environment.apiSuffixes.mapLocations
  //   ).as('getLocations');
  //   cy.visit('/locaties');
  //   cy.wait('@getLocations').its('response.statusCode').should('eq', 200);
  // });
});
