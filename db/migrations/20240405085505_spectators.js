exports.up = function(knex) {
    return knex.schema.createTable('spectators', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('phone').notNullable();
      table.boolean('permanent').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.foreign('user_id').references('users.id');

      table.index('user_id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('spectators');
  };
  