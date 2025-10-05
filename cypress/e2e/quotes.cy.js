describe('Quote generator - live site', () => {
  const clickDelay = 400; // matches your fade animation

  beforeEach(() => {
    cy.visit('/');
  });

  it('shows a quote on load', () => {
    cy.get('#quote.visible', { timeout: 12000 })
      .should('be.visible')
      .invoke('text')
      .should((text) => expect(text.trim()).to.not.equal(''));
  });

  it('advances to the next quote on button click', () => {
    let firstQuote;
    cy.get('#quote.visible', { timeout: 12000 })
      .invoke('text')
      .then((t) => { firstQuote = t.trim(); });

    cy.get('#new-quote').click();
    cy.wait(clickDelay);

    cy.get('#quote.visible')
      .invoke('text')
      .should((t) => expect(t.trim()).to.not.eq(firstQuote));
  });

  it('loops back after cycling through all quotes (robust)', () => {
    // 1) get the number of quotes from the live JSON
    cy.request(`${Cypress.config('baseUrl')}/support_quotes.json`).then((res) => {
      const totalQuotes = Array.isArray(res.body) ? res.body.length : 0;
      expect(totalQuotes).to.be.greaterThan(0);

      // 2) capture the initial visible quote (wait for it)
      cy.get('#quote.visible', { timeout: 12000 })
        .invoke('text')
        .then((initial) => {
          const initialQuote = initial.trim();

          // 3) click exactly totalQuotes times in a Cypress-safe recursive chain
          const clickTimes = (n) => {
            if (n <= 0) return cy.wrap(null);
            return cy.get('#new-quote').click()
              .wait(clickDelay)
              .then(() => clickTimes(n - 1));
          };

          // run clicks, then assert we returned to the initial quote
          clickTimes(totalQuotes).then(() => {
            cy.get('#quote.visible', { timeout: 12000 })
              .invoke('text')
              .should((finalText) => {
                expect(finalText.trim()).to.eq(initialQuote);
              });
          });
        });
    });
  });
});
