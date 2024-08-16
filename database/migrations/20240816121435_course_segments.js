/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("course_segments", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("value").notNullable();
    table.integer("order_number").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("course_infos");
};
