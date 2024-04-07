exports.up = function(knex) {
    return knex.schema.createTable('spectator_pinned_students', function(table) {
      table.increments('id').primary();
      table.integer('spectator_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();

      table.foreign('spectator_id').references('spectators.id');
      table.foreign('student_id').references('students.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('spectator_pinned_students');
  };
  