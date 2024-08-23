/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("time_of_day").del();
  await knex("time_of_day").insert([
    { name: "Aamu", from_hour: "06:00", to_hour: "12:00" },
    { name: "Päivä", from_hour: "12:00", to_hour: "18:00" },
    { name: "Ilta", from_hour: "18:00", to_hour: "24:00"},
  ]);
};