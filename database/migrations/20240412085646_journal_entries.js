exports.up = function (knex) {
  return knex.schema.createTable("journal_entries", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("entry_type_id").unsigned();
    table.integer("workout_type_id").unsigned();
    table.integer("workout_category_id").unsigned();
    table.integer("time_of_day_id").unsigned();
    table.integer("length_in_minutes");
    table.integer("workout_intensity_id").unsigned(),
    table.text("details");
    table.timestamp("date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at");

    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table
      .foreign("entry_type_id")
      .references("journal_entry_types.id")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .foreign("workout_type_id")
      .references("workout_types.id")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .foreign("workout_category_id")
      .references("workout_categories.id")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .foreign("time_of_day_id")
      .references("time_of_day.id")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .foreign("workout_intensity_id")
      .references("workout_intensities.id")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("journal_entries");
};
