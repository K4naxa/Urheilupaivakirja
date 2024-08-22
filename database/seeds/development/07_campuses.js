/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('campuses').del()
  await knex('campuses').insert([
    {name: 'Ajokinkuja, Tampere'},
    {name: 'Hepolamminkatu, Tampere'},
    {name: 'Kangasala'},
    {name: 'Silta-kampus, Nokia'},
    {name: 'Lempäälä'},
    {name: 'Mediapolis, Tampere'},
    {name: 'Metsätie, Ylöjärvi'},
    {name: 'Orivesi'},
    {name: 'Pallotie, Ylöjärvi'},
    {name: 'Pirkkala'},
    {name: 'Sammonkatu, Tampere'},
    {name: 'Santalahdentie, Tampere'},
    {name: 'Virrat'},
  ]);
};