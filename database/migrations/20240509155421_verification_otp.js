exports.up = function (knex) {
  return knex.schema.createTable("verification_otp", (table) => {
    table.increments("id");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.string("otp_hash").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("verification_otp");
};