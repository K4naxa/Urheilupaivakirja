exports.up = function (knex) {
    return knex.schema.createTable("password_reset_token", (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
      table.string("token_hash").notNullable();
      table.timestamp("expires_at").notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("password_reset_token");
  };