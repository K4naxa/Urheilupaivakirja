exports.up = function(knex) {
    return knex.schema.createTable('news', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('user_id').references('users.id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('news');
  };
  