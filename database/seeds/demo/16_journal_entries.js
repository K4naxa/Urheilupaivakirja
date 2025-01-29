const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const testPassword = "salasana";

function createJournalEntry(userId, date) {
  // Create a copy of the date to avoid modifying the original
  const entryDate = new Date(date);
  // Randomize time components
  entryDate.setHours(faker.number.int({ min: 0, max: 23 }));
  entryDate.setMinutes(faker.number.int({ min: 0, max: 59 }));
  entryDate.setSeconds(faker.number.int({ min: 0, max: 59 }));

  return {
    user_id: userId,
    entry_type_id: 1,
    workout_type_id: faker.number.int({ min: 1, max: 3 }),
    workout_category_id: faker.number.int({ min: 1, max: 3 }),
    time_of_day_id: faker.number.int({ min: 1, max: 3 }),
    length_in_minutes: faker.number.int({ min: 30, max: 300 }),
    workout_intensity_id: faker.number.int({ min: 1, max: 3 }),
    details: faker.lorem.sentence(),
    date: entryDate,
    created_at: entryDate,
    updated_at: null,
  };
}

exports.seed = function (knex) {
  return knex("users")
    .where("role_id", 3)
    .select("id")
    .then(function (students) {
      const entries = [];
      const entryCounts = {};
      const startDate = new Date(2025, 0, 1);

      students.forEach((student) => {
        entryCounts[student.id] = 0;
        for (let i = 0; i < 130; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);

          // 80% chance for at least one entry
          if (Math.random() < 0.8) {
            entries.push(createJournalEntry(student.id, currentDate));
            entryCounts[student.id]++;

            // 50% chance for second entry
            if (Math.random() < 0.5) {
              entries.push(createJournalEntry(student.id, currentDate));
              entryCounts[student.id]++;
            }
            if (Math.random() < 0.3) {
              entries.push(createJournalEntry(student.id, currentDate));
              entryCounts[student.id]++;
            }
          }
        }
      });

      return knex("journal_entries")
        .insert(entries)
        .then(() => {
          const updatePromises = students.map((student) => {
            return knex("students")
              .where("user_id", student.id)
              .update({ total_entry_count: entryCounts[student.id] });
          });
          return Promise.all(updatePromises);
        });
    });
};
