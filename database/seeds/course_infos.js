/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("course_infos").del();
  await knex("course_infos").insert([
    { id: 1, name: "complition_requirement", value: 300 },
  ]);
};
