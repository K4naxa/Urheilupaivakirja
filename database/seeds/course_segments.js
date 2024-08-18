/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("course_segments").del();
  await knex("course_segments").insert([
    { id: 1, name: "Aloittelija", value: 100, order_number: 1 },
    { id: 2, name: "Harrastelija", value: 100, order_number: 2 },
    { id: 3, name: "Ammatti urheilija", value: 100, order_number: 3 },
  ]);
};
