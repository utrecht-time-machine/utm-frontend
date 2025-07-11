import { environment } from '../support/environment-utils';

describe('Specific route page', () => {
  it('should load the Vollenhoven route page', () => {
    cy.visit('/routes/vollenhoven');
    cy.contains('Ontdek de bijzondere geschiedenis');
  });

  it('should navigate to second point and show audio player and title', () => {
    cy.visit('/routes/vollenhoven');

    cy.get('div#nav_menu').should('be.visible');

    cy.get('div#nav_menu li').eq(2).click();

    cy.get('div.audioplayer').should('exist');

    cy.contains('Het grote huis').should('be.visible');
  });

  it('should switch language to English and display translated content', () => {
    cy.visit('/routes/vollenhoven');

    cy.get('app-lang-toggle a').eq(1).click();

    cy.contains(/Discover the (special|unique) history/).should('be.visible');
  });
});
