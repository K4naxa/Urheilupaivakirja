var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const saltRounds = config.BCRYPTSALT;
const { createToken } = require("../../utils/authMiddleware");
const { isAuthenticated } = require("../../utils/authMiddleware");

// Register a new student
router.post("/", async (req, res, next) => {
  const user = req.body;

  try {
    await knex.transaction(async (trx) => {
      // Hash the password
      const passwordHash = await bcrypt.hash(user.password, Number(saltRounds));

      // Prepare new user data
      const newUser = {
        email: user.email,
        password: passwordHash,
        role_id: 3, // Default role for student
        email_verified: false,
        created_at: new Date(),
      };

      async function checkIfNew(tableName, id) {
        const existingId = await trx.select('id').from(tableName).where('id', id).first();
        if (!existingId) {
          const [newId] = await trx(tableName).insert({ name: id, created_by: user.first_name + ' ' + user.last_name});
          return newId;
        }
        return id;
      }

      // Insert the new user and get the id of the inserted user
      const [userId] = await trx("users").insert(newUser);

      // Check and insert sport, and student group if value/id is new
      const sportId = await checkIfNew('sports', user.sport_id);
      const groupId = await checkIfNew('student_groups', user.group_id);

      // Prepare new student data
      const newStudent = {
        user_id: userId,
        first_name: user.first_name,
        last_name: user.last_name,
        sport_id: sportId,
        group_id: groupId,
        campus_id: user.campus_id,
        created_at: new Date(),
      };

      // Insert the new student
      await trx("students").insert(newStudent);

      const token = await createToken({ ...newUser, id: userId });
      res.status(201).json({
        token,
        email_verified: newUser.email_verified,
        email: newUser.email,
        role: newUser.role_id,
      });
    });
  } catch (err) {
    console.error("POST /user/register transaction error:", err);
    res.status(500).json({
      error: "An error occurred while creating a new student user: " + err.message,
    });
  }
});

router.post("/new-email-verification", isAuthenticated, async (req, res) => {

  try {
    // does user exist?
    const user = await knex("users").where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let firstName = "";

    switch (user.role_id) {
      case 1: // Teacher
        const teacher = await knex("teachers")
          .where({ user_id: user.id })
          .first();
        firstName = teacher ? teacher.first_name : null;
        break;
      case 2: // Spectator
        const spectator = await knex("spectators")
          .where({ user_id: user.id })
          .first();
        firstName = spectator ? spectator.first_name : null;
        break;
      case 3: // Student
        const student = await knex("students")
          .where({ user_id: user.id })
          .first();
        firstName = student ? student.first_name : null;
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    if (!firstName) {
      return res.status(404).json({ message: "First name not found for user" });
    }

    const existingToken = await knex("verification_otp")
      .where({ user_id: user.id })
      .orderBy("created_at", "desc")
      .first();

    if (existingToken) {
      const now = Date.now();
      const tokenCreationTime = new Date(existingToken.created_at).getTime();
      const timeSinceLastToken = now - tokenCreationTime;
      const cooldownPeriod = 5 * 60 * 1000; // 5min

      if (timeSinceLastToken < cooldownPeriod) {
        const waitTime = Math.ceil(
          (cooldownPeriod - timeSinceLastToken) / 1000 / 60
        ); // remaining wait time in minutes
        return res.status(429).json({
          message: `A reset email has already been sent recently. Please check your email or try again in ${waitTime} minutes.`,
        });
      }
    }

    // if no recent token, delete any old tokens
    await knex("verification_otp").where({ user_id: user.id }).del();

    const resetOTP = otpGenerator.generate(8, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const OTP_hash = await bcrypt.hash(resetOTP, Number(saltRounds));

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hours

    // Store the new token in the database
    await knex("verification_otp").insert({
      user_id: user.id,
      otp_hash: OTP_hash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    // Send the email
    sendEmail(
      user.email,
      "Urheilupäiväkirja - Vahvista sähköpostiosoitteesi",
      { name: firstName, otp: resetOTP },
      "./template/verifyEmail.handlebars"
    );

    res.json({
      message: "Reset token generated and sent to your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating reset token" });
  }
});

router.post("/verify-email", isAuthenticated, async (req, res) => {
  const userId = req.user.user_id;
  const { otp } = req.body;

  try {
    // check database for token
    const tokenEntry = await knex("verification_otp")
      .where({ user_id: userId })
      .first();

    if (!tokenEntry) {
      return res.status(404).json({ message: "No OTP found" });
    }

    // Validate OTP and check if it's expired
    const isTokenValid = await bcrypt.compare(otp, tokenEntry.otp_hash);
    const isTokenExpired = new Date() > new Date(tokenEntry.expires_at);

    if (!isTokenValid || isTokenExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    // update user's email verified status
    await knex("users").where({ id: userId }).update({ email_verified: true });

    await knex("verification_otp").where({ user_id: userId }).del();

    const user = await knex("users").where({ id: userId }).first();

    const newToken = createToken({
      email: user.email,
      id: user.id,
      role_id: user.role_id,
      email_verified: user.email_verified,
    });

    res.json({
      token: newToken,
      email_verified: user.email_verified,
      email: user.email,
      role: user.role_id,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

module.exports = router;