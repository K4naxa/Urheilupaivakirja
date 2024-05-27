exports.up = function(knex) {
    return knex.schema.createTable('time_of_day', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('from_hour').notNullable();
      table.string('to_hour').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('time_of_day');
  };
  