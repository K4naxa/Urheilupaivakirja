/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('workout_categories').del()
  await knex('workout_categories').insert([
    {name: 'Oma laji'},
    {name: 'Vaihtoehto 1'},
    {name: 'Vaihtoehto 2'},
    {name: 'Vaihtoehto 3'},
    {name: 'Vaihtoehto 4'},
  ]);
};
