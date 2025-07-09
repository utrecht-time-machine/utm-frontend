describe('Search', () => {
  it('should show live results for search field', () => {
    cy.visit('/locaties');
    cy.get('input#edit-livesearch').click().type('ACU');

    cy.get('.search-api-autocomplete-search').should('exist');

    cy.get('.search-api-autocomplete-search li').should(
      'have.length.greaterThan',
      1
    );

    cy.get('.search-api-autocomplete-search li')
      .contains('ACU')
      .should('exist');
  });

  // TODO: Add test where search results are clicked and correct page is loaded

  // TODO: Check if the different types of search results load correctly (locations, stories, routes, coordinates on map, ...)
});
