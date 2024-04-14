const { faker } = require('@faker-js/faker');
const fs = require('fs');
const testPassword = "salasana"

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hashedpassword = bcrypt.hashSync(testPassword, salt);

let users = [];

for (let i = 0; i < 10; i++) {
    users.push({
      email: faker.internet.email(),
      password: hashedpassword,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      role: 0,
      email_verified: true,
      created_at: faker.date.recent(),
      last_login_at: faker.date.recent()
    });
  }

// Save the generated data to a file
fs.writeFileSync('usersData.json', JSON.stringify(users, null, 2), 'utf-8');
