exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.integer("role_id").unsigned();
    table.boolean("email_verified").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("last_login_at");
    table.integer("token_version").defaultTo(0);
    table.foreign("role_id").references("roles.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
