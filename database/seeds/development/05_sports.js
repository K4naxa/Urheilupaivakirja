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
      is_verified: true
    },
    {
      name: "Jääkiekko",
      is_verified: true
    },
    {
      name: "Pesäpallo",
      is_verified: true
    },
    {
      name: "Voimistelu",
      is_verified: true
    },
    {
      name: "Moukarinheitto",
      is_verified: true
    },
    {
      name: "Keihäänheitto",
      is_verified: true
    },
    {
      name: "Taitoluistelu",
      is_verified: true
    },
    {
      name: "Eukonkanto",
      is_verified: true
    },
    {
      name: "Ohjelmointi",
      is_verified: true
    },
    {
      name: "Vitsailu",
      is_verified: false
    },
  ]);
};
