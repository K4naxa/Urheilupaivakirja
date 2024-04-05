/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("sports").del();
  await knex("sports").insert([
    {
      name: "Jalkapallo",
    },
    {
      name: "Jääkiekko",
    },
    {
      name: "Pesäpallo",
    },
    {
      name: "Voimistelu",
    },
    {
      name: "Moukarinheitto",
    },
    {
      name: "Keihäänheitto",
    },
    {
      name: "Taitoluistelu",
    },
    {
      name: "Eukonkanto",
    },
    {
      name: "Ohjelmointi",
    },
    {
      name: "Vitsailu",
    },
  ]);
};
