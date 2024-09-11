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
  ]);
};
