describe('Quote generator - sequence', () => {
  beforeEach(() => {
    // When run via start-server-and-test, baseUrl is http://localhost:8080
    cy.visit('/');
  });

  it('shows a quote on load', () => {
    cy.get('#quote').should('be.visible').invoke('text').should('not.be.empty');
  });

  it('advances to the next quote on button click', () => {
    cy.fixture('support_quotes.json').then((quotes) => {
      // initial should be first quote
      cy.get('#quote').invoke('text').should('eq', quotes[0]);

      // click once -> should show second quote
      cy.get('#new-quote').click();
      cy.wait(300);
      cy.get('#quote').invoke('text').should('eq', quotes[1]);
    });
  });

  it('loops back to first quote after cycling through all', () => {
    cy.fixture('support_quotes.json').then((quotes) => {
      // click quotes.length times to complete a full rotation
      for (let i = 0; i < quotes.length; i++) {
        cy.get('#new-quote').click();
        cy.wait(300);
      }
      // After a full rotation we should be back to the first quote
      cy.get('#quote').invoke('text').should('eq', quotes[0]);
    });
  });
});
