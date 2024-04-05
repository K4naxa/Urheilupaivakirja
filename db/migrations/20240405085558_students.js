exports.up = function(knex) {
    return knex.schema.createTable('students', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('phone').notNullable();
      table.integer('sport_id').unsigned();
      table.integer('group_id').unsigned();
      table.integer('campus_id').unsigned();
      table.boolean('activated').notNullable().defaultTo(false);
      table.boolean('archived').notNullable().defaultTo(false);
      table.timestamp('archived_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('news_last_viewed_at');
  
      table.foreign('user_id').references('users.id');
      table.foreign('sport_id').references('sports.id');
      table.foreign('group_id').references('student_groups.id');
      table.foreign('campus_id').references('campuses.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('students');
  };
  