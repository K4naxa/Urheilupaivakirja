/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('student_groups').del()
  await knex('student_groups').insert([
    {group_identifier: '2008tivip0k'},
    {group_identifier: '2108havup0k'},
    {group_identifier: '2208notso0k'},
    {group_identifier: '2308maybe0k'},
    {group_identifier: '2408never0k'}
  ]);
};