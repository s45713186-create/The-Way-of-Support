describe('Quote generator - live site', () => {
  const clickDelay = 400; // for JS fade animation

  beforeEach(() => {
    // Visit the live site using baseUrl from CircleCI env
    cy.visit('/');
  });

  it('shows a quote on load', () => {
    cy.get('#quote.visible', { timeout: 12000 }) // wait for fade-in
      .should('be.visible')
      .invoke('text')
      .should((text) => {
        expect(text.trim()).to.not.equal('');
      });
  });

  it('advances to the next quote on button click', () => {
    let firstQuote;

    cy.get('#quote.visible', { timeout: 12000 })
      .invoke('text')
      .then((text) => {
        firstQuote = text.trim();
      });

    cy.get('#new-quote').click();
    cy.wait(clickDelay);

    cy.get('#quote.visible')
      .invoke('text')
      .should((text) => {
        expect(text.trim()).to.not.eq(firstQuote);
      });
  });

  it('loops back after cycling through all quotes', () => {
    const maxClicks = 50; // arbitrarily large to ensure full cycle
    let initialQuote;

    cy.get('#quote.visible', { timeout: 12000 })
      .invoke('text')
      .then((text) => {
        initialQuote = text.trim();
      });

    for (let i = 0; i < maxClicks; i++) {
      cy.get('#new-quote').click();
      cy.wait(clickDelay); // wait for fade-in
    }

    cy.get('#quote.visible')
      .invoke('text')
      .should((text) => {
        expect(text.trim()).to.eq(initialQuote);
      });
  });
});
