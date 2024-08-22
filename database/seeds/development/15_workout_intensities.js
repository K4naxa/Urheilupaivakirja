/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("workout_intensities").del();
  await knex("workout_intensities").insert([
    { name: "Kevyt" },
    { name: "Normaali" },
    { name: "Raskas" },
  ]);
};
