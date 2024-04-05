const testPassword = "salasana";

var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var hashedpassword = bcrypt.hashSync(testPassword, salt);

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          email: "admin@example.com",
          password: hashedpassword,
          role_id: 1,
          email_verified: true,
          created_at: new Date(2024, 1, 1, 16, 0),
          last_login_at: new Date(2024, 1, 2, 16, 54),
        },
        {
          email: "kayttaja@example.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2024, 1, 1, 16, 0),
          last_login_at: new Date(2024, 1, 2, 16, 54),
        },
        {
          email: "spectator@example.com",
          password: hashedpassword,
          role_id: 2,
          email_verified: true,
          created_at: new Date(2024, 1, 1, 16, 0),
          last_login_at: new Date(2024, 1, 2, 16, 54),
        },
        {
          email: "spectator2@example.com",
          password: hashedpassword,
          role_id: 2,
          email_verified: true,
          created_at: new Date(2024, 1, 2, 16, 0),
          last_login_at: new Date(2024, 1, 3, 16, 54),
        },
        {
          email: "tina97@jordan.net",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2023, 2, 19, 16, 0),
          last_login_at: new Date(2024, 1, 19, 16, 54),
        },
        {
          email: "aaronmartinez@bradley.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2023, 0, 27, 3, 42, 52),
          last_login_at: new Date(2024, 2, 24, 7, 49, 7),
        },
        {
          email: "frankhammond@yahoo.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2023, 4, 11, 20, 59, 27),
          last_login_at: new Date(2024, 1, 12, 0, 4, 29),
        },
        {
          email: "phillipsnicholas@mcclain-gordon.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2021, 4, 15, 23, 3, 46),
          last_login_at: new Date(2024, 2, 31, 22, 19, 42),
        },
        {
          email: "diana21@hotmail.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2023, 3, 17, 16, 31, 23),
          last_login_at: new Date(2024, 0, 7, 14, 28, 23),
        },
        {
          email: "mwilliams@pierce.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2020, 10, 26, 2, 46, 39),
          last_login_at: new Date(2024, 0, 30, 10, 9, 26),
        },
        {
          email: "jameskelley@ramirez.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2024, 1, 28, 0, 59, 1),
          last_login_at: new Date(2024, 2, 16, 20, 19, 29),
        },
        {
          email: "michellecarrillo@gmail.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2022, 7, 2, 3, 26, 20),
          last_login_at: new Date(2024, 0, 28, 19, 12, 1),
        },
        {
          email: "dariusowens@lawson.com",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2021, 10, 19, 2, 1, 14),
          last_login_at: new Date(2024, 1, 14, 22, 11, 5),
        },
        {
          email: "jessicawilliams@anderson.net",
          password: hashedpassword,
          role_id: 3,
          email_verified: true,
          created_at: new Date(2020, 5, 28, 5, 14, 18),
          last_login_at: new Date(2024, 2, 4, 12, 10, 6),
        },
      ]);
    });
};
