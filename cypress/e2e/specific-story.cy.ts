import { environment } from '../support/environment-utils';

describe('Story page', () => {
  it('should load story via query parameter URL format', () => {
    cy.visit('/locaties/domtoren?story=de-domtoren-een-waanzinnig-bouwproject');
    cy.contains('Het is feest!').should('be.visible');
    cy.get('app-story').should('exist');
  });

  it('should load story via direct story URL format', () => {
    cy.visit('/story/de-domtoren-een-waanzinnig-bouwproject');
    cy.contains('Het is feest!').should('be.visible');
    cy.get('app-story').should('exist');
  });

  it('should load images in the image viewer correctly', () => {
    cy.visit('/story/de-domtoren-een-waanzinnig-bouwproject');

    cy.get('app-story app-image-viewer').should('be.visible');

    cy.get('app-story app-image-viewer img')
      .should('be.visible')
      .and(($img) => {
        $img.each((i, el) => {
          const img = el as HTMLImageElement;
          expect(img.naturalWidth).to.be.greaterThan(0);
        });
      });
  });

  it('should fetch story details from API', () => {
    cy.intercept(
      'GET',
      environment.apiUrl + environment.apiSuffixes.storyDetailsById + '1069'
    ).as('getStoryDetails');

    cy.visit('/story/de-domtoren-een-waanzinnig-bouwproject');

    cy.wait('@getStoryDetails').its('response.statusCode').should('eq', 200);
  });
});
