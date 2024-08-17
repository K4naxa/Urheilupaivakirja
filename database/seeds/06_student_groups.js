/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('student_groups').del()
  await knex('student_groups').insert([
    {name: '2008tivip0k', is_verified: true},
    {name: '2108havup0k', is_verified: true},
    {name: '2208notso0k', is_verified: true},
    {name: '2308maybe0k', is_verified: true},
    {name: '2408never0k', is_verified: true},
    {name: '2508futur0k', is_verified: false}
  ]);
};