describe('Intro page', () => {
  it('Check intro page contents', () => {
    cy.visit('/intro');
    cy.contains('Ontdek verborgen erfgoed in de provincie');
  });

  it('should switch language to English and display translated content', () => {
    cy.visit('/intro');

    cy.get('app-lang-toggle a').eq(1).click();

    cy.contains('Discover').should('be.visible');
  });
});
