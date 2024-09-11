/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("teachers").del();
  await knex("teachers").insert([
    {
      user_id: 1,
      first_name: "Antti",
      last_name: "Admin",
      created_at: new Date(),
    },
  ]);
};
