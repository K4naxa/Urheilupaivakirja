exports.up = function(knex) {
    return knex.schema.createTable('time_of_day', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('time_of_day');
  };
  