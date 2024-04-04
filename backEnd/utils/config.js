require('dotenv').config()

let PORT = process.env.PORT
let SECRET = process.env.SECRET

let DATABASE_OPTIONS = {
    client: process.env.DB_TYPE,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    }
}

module.exports = {
  DATABASE_OPTIONS,
  PORT,
  SECRET
}