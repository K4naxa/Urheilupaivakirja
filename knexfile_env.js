// Update with your config settings.
// require("dotenv").config();  // < -- This is not needed, when you give the values through docker-compose.yml

module.exports = {
  production: {
    client: process.env.DB_TYPE || "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    },
  },
};
