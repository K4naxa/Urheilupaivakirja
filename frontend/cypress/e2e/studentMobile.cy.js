describe("Student basic functionalitys", () => {
  beforeEach(() => {
    cy.visit("localhost:5173");
    cy.viewport("iphone-6");
    cy.contains("Kirjautuminen");

    cy.get('input[type="email"]').type("student@example.com");
    cy.get('input[type="password"]').type("salasana");

    cy.contains("Kirjaudu").click();
  });

  it("should navigate to user menu and log out", () => {
    cy.get("#mobile-header").should("be.visible");
    // Click on the user menu button
    cy.get("#mobile-header").contains("Käyttäjä").click();

    // Check that the user menu is visible
    cy.get("#mobile-header").contains("Profiili");
    cy.get("#mobile-header").contains("Kirjaudu ulos");

    // Click on the logout button
    cy.get("#mobile-header").contains("Kirjaudu ulos").click();
  });
});
