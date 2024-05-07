/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

formatDate = (date) => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("journal_entries").del();
  await knex("journal_entries").insert([
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 30,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treenattu on",
      date: formatDate(new Date(2024, 1, 1, 0, 0)),
      created_at: new Date(2024, 1, 1, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 2,
      details: "Lepopäivä",
      date: formatDate(new Date(2024, 1, 2, 0, 0)),
      created_at: new Date(2024, 1, 2, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 3,
      details: "Sairaana",
      date: formatDate(new Date(2024, 1, 3, 0, 0)),
      created_at: new Date(2024, 1, 3, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 60,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treeni #1",
      date: formatDate(new Date(2024, 1, 4, 0, 0)),
      created_at: new Date(2024, 1, 4, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 90,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treeni #2",
      date: formatDate(new Date(2024, 1, 4, 0, 0)),
      created_at: new Date(2024, 1, 4, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 120,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treeni #1",
      date: formatDate(new Date(2024, 1, 5, 0, 0)),
      created_at: new Date(2024, 1, 5, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 150,
      time_of_day_id: 2,
      intensity: 2,
      details: "Treeni #2",
      date: formatDate(new Date(2024, 1, 5, 0, 0)),
      created_at: new Date(2024, 1, 5, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 180,
      time_of_day_id: 3,
      intensity: 3,
      details: "Treeni #3",
      date: formatDate(new Date(2024, 1, 5, 0, 0)),
      created_at: new Date(2024, 1, 5, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 2,
      workout_category_id: 1,
      length_in_minutes: 30,
      time_of_day_id: 1,
      intensity: 3,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 6, 0, 0)),
      created_at: new Date(2024, 1, 6, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 3,
      workout_category_id: 1,
      length_in_minutes: 60,
      time_of_day_id: 2,
      intensity: 3,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 7, 0, 0)),
      created_at: new Date(2024, 1, 7, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 3,
      workout_category_id: 1,
      length_in_minutes: 60,
      time_of_day_id: 2,
      intensity: 3,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 7, 0, 0)),
      created_at: new Date(2024, 1, 7, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 2,
      length_in_minutes: 30,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 8, 0, 0)),
      created_at: new Date(2024, 1, 8, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 3,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 3, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 120,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 3, 20, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 1,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 3, 2, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 5, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 200,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 5, 10, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 3,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 1,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 1,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 21, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 17, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 300,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 1, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 20, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 2,
      details: "Lepopäivä",
      date: formatDate(new Date(2024, 3, 17, 0, 0)),
      created_at: new Date(2024, 4, 19, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 3,
      details: "Sairaana",
      date: formatDate(new Date(2024, 3, 16, 0, 0)),
      created_at: new Date(2024, 4, 18, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 120,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 3, 20, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 3, 2, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 5, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 200,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 5, 10, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 21, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 17, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 300,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 1, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 20, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 3,
      entry_type_id: 1,
      workout_type_id: 3,
      workout_category_id: 1,
      length_in_minutes: 60,
      time_of_day_id: 2,
      intensity: 3,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 7, 0, 0)),
      created_at: new Date(2024, 1, 7, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 90,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treeni #2",
      date: formatDate(new Date(2024, 1, 4, 0, 0)),
      created_at: new Date(2024, 1, 4, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 120,
      time_of_day_id: 1,
      intensity: 1,
      details: "Treeni #1",
      date: formatDate(new Date(2024, 1, 5, 0, 0)),
      created_at: new Date(2024, 1, 5, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 1,
      length_in_minutes: 150,
      time_of_day_id: 2,
      intensity: 2,
      details: "Treeni #2",
      date: formatDate(new Date(2024, 1, 5, 0, 0)),
      created_at: new Date(2024, 1, 5, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 18, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 21, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 17, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 300,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 1, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 1,
      workout_category_id: 3,
      length_in_minutes: 90,
      time_of_day_id: 3,
      intensity: 2,
      details: "Treenipäivä",
      date: formatDate(new Date(2024, 4, 20, 0, 0)),
      created_at: new Date(2024, 4, 17, 0, 0),
    },
    {
      user_id: 7,
      entry_type_id: 1,
      workout_type_id: 3,
      workout_category_id: 1,
      length_in_minutes: 60,
      time_of_day_id: 2,
      intensity: 3,
      details: "Treeni 1",
      date: formatDate(new Date(2024, 1, 7, 0, 0)),
      created_at: new Date(2024, 1, 7, 0, 0),
    },
  ]);
};
