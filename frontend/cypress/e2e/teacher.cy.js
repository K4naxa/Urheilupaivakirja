describe("Teacher basic functionalitys", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.visit("localhost:5173");
    cy.contains("Kirjautuminen");

    cy.get('input[type="email"]').type("teacher@example.com");
    cy.get('input[type="password"]').type("salasana");

    cy.contains("Kirjaudu").click();
  });

  it("should navigate to user menu and log out", () => {
    cy.get("#desktop-header").should("be.visible");
    cy.get("#desktop-header").contains("Käyttäjä").click();
    cy.get("#desktop-header").contains("Profiili");
    cy.get("#desktop-header").contains("Asetukset");
    cy.get("#desktop-header").contains("Kirjaudu ulos");
    cy.get("#desktop-header").contains("Kirjaudu ulos").click();
  });

  // SPORT TESTS ----------------------------------------------------------------------------------------------------------------
  it("should navigate to Sports and create new sport", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Lajit").click();
    cy.get("[data-testid=newSportInput]").type("CypressTestInput{enter}");
    cy.get("[data-testid=newSportInput]").clear();
    cy.get("#sportsContainer").contains("CypressTestInput");
  });

  it("should navigate to Sports and check for duplicate error", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Lajit").click();
    cy.get("[data-testid=newSportInput]").type("CypressTestInput{enter}");
    cy.get("#errorHeader").contains("Laji on jo olemassa");
  });

  it("should navigate to Sports and edit a sport", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Lajit").click();
    cy.get("#sportsContainer").contains("CypressTestInput");
    cy.contains("CypressTestInput")
      .parent()
      .parent()
      .find("button#editBtn")
      .click();
    cy.get("input#editSport").clear();
    cy.get("input#editSport").type("CypressTestInputEdit{enter}");
    cy.get("#sportsContainer").contains("CypressTestInputEdit");
  });

  it("should navigate to hallinta and delete a sport", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Lajit").click();
    cy.get("#sportsContainer").contains("CypressTestInputEdit");
    cy.contains("CypressTestInputEdit")
      .parent()
      .parent()
      .find("button#deleteBtn")
      .click();
    cy.get("#sportsContainer").should("not.contain", "CypressTestInputEdit");
  });

  // GROUPS TESTS ----------------------------------------------------------------------------------------------------------------

  it("should navigate to hallinta and create new group", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Ryhmät").click();
    cy.get("input").type("CypressTestInput{enter}");
    cy.get("input").clear();
    cy.get("#groupsContainer").contains("CypressTestInput");
  });

  it("should navigate to hallinta and check for duplicate error", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Ryhmät").click();
    cy.get("input").type("CypressTestInput{enter}");
    cy.get("#errorHeader").contains("Ryhmä on jo olemassa");
  });

  it("should navigate to hallinta and edit a group", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Ryhmät").click();
    cy.get("#groupsContainer").contains("CypressTestInput");
    cy.contains("CypressTestInput").parent().find("button#editBtn").click();
    cy.get("input#editInput").clear();
    cy.get("input#editInput").type("CypressTestInputEdit{enter}");
    cy.get("#groupsContainer").contains("CypressTestInputEdit");
  });

  it("should navigate to hallinta and delete a group", () => {
    cy.get("#desktop-header").contains("Hallinta").click();
    cy.get("#manage-nav").contains("Ryhmät").click();
    cy.get("#groupsContainer").contains("CypressTestInputEdit");
    cy.contains("CypressTestInputEdit")
      .parent()
      .find("button#deleteBtn")
      .click();
    cy.get("#groupsContainer").should("not.contain", "CypressTestInputEdit");
  });
});
