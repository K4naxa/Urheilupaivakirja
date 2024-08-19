exports.up = function (knex) {
  return knex.schema
    .createTable("news", function (table) {
      table.increments("id").primary();
      table.integer("teacher_id").unsigned();
      table.string("title").notNullable();
      table.text("content").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.boolean("public").defaultTo(false);
      table.boolean("pinned").defaultTo(false);
      table.foreign("teacher_id").references("teachers.id").onDelete("SET NULL");
    })
    .then(function () {
      return knex.schema.createTable("news_campuses", function (table) {
        table.increments("id").primary();
        table.integer("news_id").unsigned().notNullable();
        table.integer("campus_id").unsigned().notNullable();

        table.foreign("news_id").references("news.id").onDelete("CASCADE");
        table.foreign("campus_id").references("campuses.id").onDelete("CASCADE");
      });
    })
    .then(function () {
      return knex.schema.createTable("news_sports", function (table) {
        table.increments("id").primary();
        table.integer("news_id").unsigned().notNullable();
        table.integer("sport_id").unsigned().notNullable();

        table.foreign("news_id").references("news.id").onDelete("CASCADE");
        table.foreign("sport_id").references("sports.id").onDelete("CASCADE");
      });
    })
    .then(function () {
      return knex.schema.createTable("news_student_groups", function (table) {
        table.increments("id").primary();
        table.integer("news_id").unsigned().notNullable();
        table.integer("student_group_id").unsigned().notNullable();

        table.foreign("news_id").references("news.id").onDelete("CASCADE");
        table.foreign("student_group_id").references("student_groups.id").onDelete("CASCADE");
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("news_student_groups")
    .then(function () {
      return knex.schema.dropTable("news_sports");
    })
    .then(function () {
      return knex.schema.dropTable("news_campuses");
    })
    .then(function () {
      return knex.schema.dropTable("news");
    });
};
