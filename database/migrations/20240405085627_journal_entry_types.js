exports.up = function(knex) {
    return knex.schema.createTable('journal_entry_types', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('journal_entry_types');
  };
  