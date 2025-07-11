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

  it('should navigate to story page when clicking on a story card', () => {
    cy.visit('/locaties/domtoren');

    cy.location().then((initialLoc) => {
      cy.get('div.story').first().click();

      cy.location().then((currentLoc) => {
        expect(
          currentLoc.pathname !== initialLoc.pathname ||
            currentLoc.search !== initialLoc.search
        ).to.be.true;
      });

      cy.get('app-story').should('exist');
    });
  });

  it('should switch language to English and display translated content', () => {
    cy.visit('/locaties/domtoren');

    cy.get('app-lang-toggle a').eq(1).click();

    cy.contains('Netherlands').should('be.visible');
  });

  it('should load images in the image viewer correctly', () => {
    cy.visit('/locaties/domtoren');

    cy.get('app-image-viewer').should('be.visible');

    cy.get('app-image-viewer img')
      .should('be.visible')
      .and(($img) => {
        $img.each((i, el) => {
          const img = el as HTMLImageElement;
          expect(img.naturalWidth).to.be.greaterThan(0);
        });
      });
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
