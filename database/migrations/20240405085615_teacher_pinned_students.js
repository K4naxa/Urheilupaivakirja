exports.up = function (knex) {
  return knex.schema.createTable("pinned_students", function (table) {
    table.increments("id").primary();
    table.integer("pinner_user_id").unsigned().notNullable();
    table.integer("pinned_user_id").unsigned().notNullable();

    table.foreign("pinner_user_id").references("users.id").onDelete("CASCADE");
    table.foreign("pinned_user_id").references("users.id").onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("pinned_students");
};
