exports.up = function (knex) {
  return knex.schema.createTable("course_infos", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("value").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("course_infos");
};
