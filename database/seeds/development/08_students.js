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
      sport_id: 1,
      group_id: 1,
      campus_id: 1,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 5,
      first_name: "Tiina",
      last_name: "Tarpoja",
      sport_id: 1,
      group_id: 2,
      campus_id: 1,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 6,
      first_name: "Aaro",
      last_name: "Autoasentaja",
      sport_id: 1,
      group_id: 2,
      campus_id: 2,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 7,
      first_name: "Martti",
      last_name: "Mainio",
      sport_id: 2,
      group_id: 2,
      campus_id: 2,
      verified: false,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 8,
      first_name: "Raisa",
      last_name: "Ruotsalainen",
      sport_id: 2,
      group_id: 3,
      campus_id: 5,
      verified: false,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 9,
      first_name: "Wille",
      last_name: "Willi",
      sport_id: 2,
      group_id: 3,
      campus_id: 5,
      verified: false,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 10,
      first_name: "Jaska",
      last_name: "Jokunen",
      sport_id: 3,
      group_id: 3,
      campus_id: 5,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 11,
      first_name: "Matti",
      last_name: "Myöhänen",
      sport_id: 5,
      group_id: 3,
      campus_id: 5,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 12,
      first_name: "Liisa",
      last_name: "Lähtönen",
      sport_id: 6,
      group_id: 4,
      campus_id: 5,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 13,
      first_name: "Etu-Nimi",
      last_name: "Sukuniminen",
      sport_id: 7,
      group_id: 4,
      campus_id: 5,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
    {
      user_id: 14,
      first_name: "Jessica",
      last_name: "Jaxu",
      sport_id: 8,
      group_id: 5,
      campus_id: 6,
      verified: true,
      created_at: new Date(2024, 1, 1),
      news_last_viewed_at: new Date(2024, 1, 1),
    },
  ]);
};