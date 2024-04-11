exports.up = function(knex) {
    return knex.schema.createTable('journal_entries', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('entry_type_id').unsigned().notNullable();
      table.integer('workout_type_id').unsigned();
      table.integer('workout_category_id').unsigned();
      table.integer('time_of_day_id').unsigned();
      table.integer('length_hours');
      table.integer('length_minutes');
      table.integer('intensity');
      table.text('details');
      table.date('date').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
  
      table.foreign('user_id').references('users.id');
      table.foreign('entry_type_id').references('journal_entry_types.id');
      table.foreign('workout_type_id').references('workout_types.id');
      table.foreign('workout_category_id').references('workout_categories.id');
      table.foreign('time_of_day_id').references('time_of_day.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('journal_entries');
  };
  