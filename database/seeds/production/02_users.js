const testPassword = "OpettajanOletusSalasana";

var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var hashedpassword = bcrypt.hashSync(testPassword, salt);

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          email: "teacher@example.com",
          password: hashedpassword,
          role_id: 1,
          email_verified: true,
          created_at: new Date(2024, 1, 1, 16, 0),
          last_login_at: new Date(2024, 1, 2, 16, 54),
        }
      ]);
    });
};
