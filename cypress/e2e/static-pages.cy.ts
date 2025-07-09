import { environment } from '../support/environment-utils';

describe('Static pages', () => {
  it('should load the About page', () => {
    cy.visit('/over');
    cy.contains('In Utrecht ligt de geschiedenis voor het oprapen');
  });

  it('should load the Provincie page', () => {
    cy.visit('/provincie');
    cy.contains('Vanaf 17 mei 2025 zijn we samen 650 jaar');
  });

  it('should load the Privacy page', () => {
    cy.visit('/privacy');
    cy.contains(
      'Deze privacyvoorwaarden beschrijven hoe we persoonlijke informatie verzamelen'
    );
  });
});
