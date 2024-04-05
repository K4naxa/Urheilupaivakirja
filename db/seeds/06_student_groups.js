/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('student_groups').del()
  await knex('student_groups').insert([
    {name: '2008tivip0k'},
    {name: '2108havup0k'},
    {name: '2208notso0k'},
    {name: '2308maybe0k'},
    {name: '2408never0k'}
  ]);
};