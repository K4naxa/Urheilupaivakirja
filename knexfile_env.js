// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: process.env.DB_TYPE,
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
    },
  },
};
