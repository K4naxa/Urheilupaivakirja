/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("time_of_day").del();
  await knex("time_of_day").insert([
    { name: "Aamu" },
    { name: "Päivä" },
    { name: "Ilta" },
  ]);
};
