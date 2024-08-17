exports.up = function (knex) {
  return knex.schema.createTable("invited_spectators", (table) => {
    table.increments("id");
    table.string("email").notNullable();
    table.string("token_hash").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("invited_spectators");
};
