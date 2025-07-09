import { environment } from '../support/environment-utils';

describe('QR code redirects', () => {
  it('should redirect from /4 to the Janskerk location page', () => {
    cy.visit('/4');
    cy.url().should('include', '/locaties/janskerk');
    cy.contains('Rijke historie aan het Janskerkhof');
  });
});
