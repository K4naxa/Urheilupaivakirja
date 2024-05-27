/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("spectators").del();
  await knex("spectators").insert([
    {
      user_id: 2,
      first_name: "Onni",
      last_name: "Opo",
      phone: "0401234567",
      created_at: new Date(),
    },

    {
      user_id: 4,
      first_name: "Valtteri",
      last_name: "Varaopo",
      phone: "0401234567",
      created_at: new Date(),
    },
  ]);
};
