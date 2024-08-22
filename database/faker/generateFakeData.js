const { faker } = require("@faker-js/faker"); // Import the faker instance correctly

const generateFakeUser = (id) => {
  return {
    id: id || faker.datatype.uuid(), // Use faker.datatype.uuid() for UUIDs
    email: faker.internet.email(),
    password: faker.internet.password(),
    // Use bcrypt to hash the password
    role_id: 3,
    email_verified: true,
    created_at: faker.date.recent(),
    last_login_at: faker.date.recent(),
  };
};

const generateFakeStudent = (id) => {
  return {
    user_id: id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    sport_id: faker.number.int({ min: 1, max: 10 }), // Use faker.datatype.number for random numbers
    group_id: faker.number.int({ min: 1, max: 5 }),
    campus_id: faker.number.int({ min: 1, max: 13 }),
    verified: 1,
    archived: 0,
    archived_at: null,
    created_at: faker.date.recent(),
    news_last_viewed_at: faker.date.recent(),
  };
};

const generateFakeJournal_entries = (id) => {
  const created = faker.date.recent({ days: 500 });
  return {
    user_id: id,
    entry_type_id: 1,
    workout_type_id: faker.number.int({ min: 1, max: 3 }),
    workout_category_id: faker.number.int({ min: 1, max: 3 }),
    time_of_day_id: faker.number.int({ min: 1, max: 3 }),
    length_in_minutes: faker.number.int({ min: 30, max: 300 }),
    workout_intensity_id: faker.number.int({ min: 1, max: 3 }),
    details: faker.lorem.sentence(),
    date: created,
    created_at: created,
    updated_at: null,
  };
};

const generateFakeUsers = (count) => {
  const users = { users: [], students: [], entries: [] };
  for (let i = 0; i < count; i++) {
    const id = i + 300;
    users.users.push(generateFakeUser(id));
    users.students.push(generateFakeStudent(id));
    for (let j = 0; j < 800; j++) {
      users.entries.push(generateFakeJournal_entries(id));
    }
  }

  return users;
};

module.exports = { generateFakeUsers };
