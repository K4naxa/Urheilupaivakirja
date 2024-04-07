exports.up = function(knex) {
    return knex.schema.createTable('teacher_pinned_students', function(table) {
      table.increments('id').primary();
      table.integer('teacher_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();

      table.foreign('teacher_id').references('teachers.id');
      table.foreign('student_id').references('students.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('teacher_pinned_students');
  };
  