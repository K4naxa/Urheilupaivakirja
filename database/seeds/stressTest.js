const { generateFakeUsers } = require("../faker/generateFakeData");

exports.seed = async function (knex) {
  const { users, students, entries } = generateFakeUsers(50);

  if (users.length > 0) {
    await knex("users").insert(users);
  }

  if (students.length > 0) {
    await knex("students").insert(students);
  }

  if (entries.length > 0) {
    await knex("journal_entries").insert(entries);
  }
};
