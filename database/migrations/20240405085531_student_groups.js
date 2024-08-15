exports.up = function(knex) {
    return knex.schema.createTable('student_groups', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('student_groups');
  };
  