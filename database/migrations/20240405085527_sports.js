exports.up = function(knex) {
    return knex.schema.createTable('sports', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('created_by');
      table.boolean('is_verified').defaultTo(false);

    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sports');
  };
  