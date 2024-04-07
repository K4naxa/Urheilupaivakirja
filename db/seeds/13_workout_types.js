/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workout_types').del()
  await knex('workout_types').insert([
    {name: 'Akatemia'},
    {name: 'Seura'},
    {name: 'Oma harjoitus'},
  ]);
};
