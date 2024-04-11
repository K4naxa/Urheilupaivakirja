/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("students").del();
  await knex("students").insert([
    {
      user_id: 3,
      first_name: "Kaapo",
      last_name: "Käyttäjäinen",
      phone: "0401234567",
      sport_id: 1,
      group_id: 1,
      campus_id: 1,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 5,
      first_name: "Tiina",
      last_name: "Tarpoja",
      phone: "0401234567",
      sport_id: 1,
      group_id: 2,
      campus_id: 1,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 6,
      first_name: "Aaro",
      last_name: "Autoasentaja",
      phone: "0401234567",
      sport_id: 1,
      group_id: 2,
      campus_id: 2,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 7,
      first_name: "Martti",
      last_name: "Mainio",
      phone: "0401234567",
      sport_id: 2,
      group_id: 2,
      campus_id: 2,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 8,
      first_name: "Raisa",
      last_name: "Ruotsalainen",
      phone: "0401234567",
      sport_id: 2,
      group_id: 3,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 9,
      first_name: "Wille",
      last_name: "Willi",
      phone: "0401234567",
      sport_id: 2,
      group_id: 3,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 10,
      first_name: "Jaska",
      last_name: "Jokunen",
      phone: "0401234567",
      sport_id: 3,
      group_id: 3,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 11,
      first_name: "Matti",
      last_name: "Myöhänen",
      phone: "0401234567",
      sport_id: 5,
      group_id: 3,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 12,
      first_name: "Liisa",
      last_name: "Lähtönen",
      phone: "0401234567",
      sport_id: 6,
      group_id: 4,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 13,
      first_name: "Etu-Nimi",
      last_name: "Sukuniminen",
      phone: "0401234567",
      sport_id: 7,
      group_id: 4,
      campus_id: 5,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
    {
      user_id: 13,
      first_name: "Jessica",
      last_name: "Jaxu",
      phone: "0401234567",
      sport_id: 8,
      group_id: 5,
      campus_id: 6,
      activated: true,
      created_at: new Date(2024, 1, 1, 16, 0),
    },
  ]);
};