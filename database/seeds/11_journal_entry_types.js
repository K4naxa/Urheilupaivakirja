/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('journal_entry_types').del()
  await knex('journal_entry_types').insert([
    {name: 'Harjoitus'},
    {name: 'Lepo'},
    {name: 'Sairaana'},
  ]);
};
