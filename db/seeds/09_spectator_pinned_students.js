/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('spectator_pinned_students').del()
  await knex('spectator_pinned_students').insert([
    {spectator_id: 1, student_id: 1},
    {spectator_id: 1, student_id: 2},
    {spectator_id: 1, student_id: 3},
    {spectator_id: 2, student_id: 4},
  ]);
};
