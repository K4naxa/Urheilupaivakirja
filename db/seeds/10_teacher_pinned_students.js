/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('teacher_pinned_students').del()
  await knex('teacher_pinned_students').insert([
    {teacher_id: 1, student_id: 1},
    {teacher_id: 1, student_id: 2},
  ]);
};
