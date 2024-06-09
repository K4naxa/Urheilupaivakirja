var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const { createToken } = require("../../middleware/auth");

router.post("/", async (req, res, next) => {
  const user = req.body;

  // check if email and password are provided
  if (!user.email || !user.password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  if (user.password.length < 8) {
    return res
      .status(400)
      .json({ error: "password must be at least 8 characters" });
  }
  const myRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!myRegEx.test(user.email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  // check if email exists in the database
  const dbUsers = await knex("users")
    .select("id", "email", "password", "email_verified", "role_id")
    .where("email", "=", user.email);
  if (dbUsers.length === 0) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  // after email is found, check if password is correct
  try {
    const tempUser = dbUsers[0];
    const passwordCorrect = await bcrypt.compare(
      user.password,
      tempUser.password
    );
    if (!passwordCorrect) {
      return res.status(401).json({ error: "invalid email or password" });
    }

    token = createToken(tempUser);

    // Update last_login_at on successful login
    await knex("users")
      .where("email", "=", tempUser.email)
      .update({ last_login_at: new Date() });

    res.status(200).send({
      token,
      email_verified: tempUser.email_verified,
      email: tempUser.email,
      role: tempUser.role_id,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
