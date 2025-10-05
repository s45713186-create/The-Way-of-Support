describe('Quote generator - live site', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows a quote on load', () => {
    cy.get('#quote')
      .should('be.visible')
      .invoke('text')
      .should('not.be.empty');
  });

  it('advances to the next quote on button click', () => {
    cy.get('#quote')
      .invoke('text')
      .then((firstQuote) => {
        cy.get('#new-quote').click();

        // wait for the quote to change
        cy.get('#quote')
          .should('have.text')
          .and((text) => expect(text).to.not.eq(firstQuote));
      });
  });

  it('loops back after cycling through all quotes', () => {
    // Fetch the live JSON to know the number of quotes
    cy.request(`${Cypress.config('baseUrl')}/support_quotes.json`).then((res) => {
      const quotes = res.body;
      const totalQuotes = quotes.length;

      let initialQuote;
      cy.get('#quote')
        .invoke('text')
        .then((text) => {
          initialQuote = text;
        });

      // Click through all quotes
      for (let i = 0; i < totalQuotes; i++) {
        cy.get('#new-quote').click();
        // wait for fade/animation
        cy.get('#quote').should('have.class', 'visible');
      }

      // After full cycle, should return to initial quote
      cy.get('#quote')
        .invoke('text')
        .should((text) => expect(text).to.eq(initialQuote));
    });
  });
});
