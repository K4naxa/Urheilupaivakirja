var express = require("express");
var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
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

module.exports = router;
