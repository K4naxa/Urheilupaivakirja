require("dotenv").config();

let PORT = process.env.PORT;
let SECRET = process.env.SECRET;
let BCRYPTSALT = process.env.BCRYPT_SALT;
let EMAIL_USERNAME = process.env.EMAIL_USERNAME;
let EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
let EMAIL_HOST = process.env.EMAIL_HOST;
let FROM_EMAIL = process.env.FROM_EMAIL;
let CLIENT_URL = process.env.CLIENT_URL;

let DATABASE_OPTIONS = {
  client: process.env.DB_TYPE,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
};

module.exports = {
  DATABASE_OPTIONS,
  PORT,
  SECRET,
  BCRYPTSALT,
  CLIENT_URL,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  FROM_EMAIL
};
