var express = require("express");
var express = require("express");
var router = express.Router();
const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const bcrypt = require("bcryptjs");
const saltRounds = config.BCRYPTSALT;

const sendEmail = require("../../utils/email/sendEmail");
const otpGenerator = require("otp-generator");
const { getRole, getUserId, createToken } = require("../../middleware/auth");

router.get("/", async (req, res) => {
  console.log("GET /spectators");
  try {
    // check if user is admin
    if (getRole(req) !== 1) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // get all users with role_id 2 (spectators)
    const users = await knex("users")
      .select("id", "email", "created_at", "email_verified", "last_login_at")
      .where("role_id", 2);

    // get first  and last name from spectators table
    const spectators = await knex("spectators").select(
      "user_id",
      "first_name",
      "last_name"
    );

    // combine the two arrays
    const combined = users.map((user) => {
      const spectator = spectators.find((s) => s.user_id === user.id);
      return { ...user, ...spectator };
    });

    res.json(combined);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new spectator
router.post("/register", async (req, res) => {
  const visitor = req.body;
  console.log("POST /spectator/register", visitor);

  try {
    await knex.transaction(async (trx) => {
      const passwordHash = await bcrypt.hash(
        visitor.password,
        Number(saltRounds)
      );

      // Prepare new user data
      const newUser = {
        email: visitor.email,
        password: passwordHash,
        role_id: 2, // Default role for spectator
        email_verified: 1,
        created_at: new Date(),
      };

      // Insert the new user and get the id of the inserted user
      const insertResult = await trx("users").insert(newUser);
      const userId = insertResult[0];

      // Prepare new spectator data
      const newSpectator = {
        user_id: userId,
        first_name: visitor.first_name,
        last_name: visitor.last_name,
        created_at: new Date(),
      };

      // Insert the new spectator
      await trx("spectators").insert(newSpectator);

      const token = await createToken({ ...newUser, id: userId });
      res.status(201).json({
        token,
        email_verified: newUser.email_verified,
        email: newUser.email,
        role: newUser.role_id,
      });
    });
  } catch (err) {
    console.error("POST /spectator/register transaction error:", err);
    res.status(500).json({
      error:
        "An error occurred while creating a new student user: " + err.message,
    });
  }
});

module.exports = router;
