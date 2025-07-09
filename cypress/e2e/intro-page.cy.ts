describe('Intro page', () => {
  it('Check intro page contents', () => {
    cy.visit('/intro');
    cy.contains('Ontdek verborgen erfgoed in de provincie');
  });
});
