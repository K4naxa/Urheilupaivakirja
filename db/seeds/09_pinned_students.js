/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('pinned_students').del()
  await knex('pinned_students').insert([
    {pinner_user_id: 1, pinned_user_id: 3},
    {pinner_user_id: 1, pinned_user_id: 4},
    {pinner_user_id: 1, pinned_user_id: 5},
    {pinner_user_id: 2, pinned_user_id: 3},
    {pinner_user_id: 2, pinned_user_id: 6},
  ]);
};
