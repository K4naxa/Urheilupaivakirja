var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const saltRounds = config.BCRYPTSALT;
const {
  createAccessToken,
  createShortRefreshToken,
} = require("../../utils/token");
const { isAuthenticated } = require("../../utils/authMiddleware");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../utils/email/sendEmail");
const { validationResult } = require("express-validator");
const { email, newPassword, first_name, last_name } = require("../../utils/validation");

// Register a new student
// Register a new student
router.post("/", [email, newPassword, first_name, last_name], async (req, res, next) => {
  const {
    email,
    password,
    first_name,
    last_name,
    sport_id,
    group_id,
    campus_id,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await knex.transaction(async (trx) => {
      // Check if the email already exists
      const existingUser = await trx("users").where({ email: email }).first();

      if (existingUser) {
        // If the email exists, respond with 409 Conflict
        return res.status(409).json({
          error: "An account with this email already exists",
        });
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, Number(saltRounds));

      // Prepare new user data
      const newUser = {
        email: email,
        password: passwordHash,
        role_id: 3, // Default role for student
        email_verified: false,
        created_at: new Date(),
      };

      async function checkIfNew(tableName, id) {
        const existingId = await trx
          .select("id")
          .from(tableName)
          .where("id", id)
          .first();

        if (!existingId) {
          const existingName = await trx
            .select("id")
            .from(tableName)
            .where("name", id)
            .first();

          if (existingName) {
            return existingName.id;
          }

          function formatNewInsert(id) {
            if (typeof id !== "string") {
              return id;
            }
            let trimmed = id.trim();
            trimmed = trimmed.replace(/\s+/g, " ");
            trimmed = trimmed.charAt(0).toLocaleUpperCase("fi-FI") + trimmed.slice(1);
            return trimmed;
          }

          trimmedName = formatNewInsert(id);
          const [newId] = await trx(tableName).insert({
            name: trimmedName,
            created_by: first_name + " " + last_name,
          });

          return newId;
        }

        return id;
      }

      // Insert the new user and get the id of the inserted user
      const [userId] = await trx("users").insert(newUser);

      const userForToken = await trx("users").where({ id: userId }).first();

      const sportId = await checkIfNew("sports", sport_id);
      const groupId = await checkIfNew("student_groups", group_id);

      // Prepare new student data
      const newStudent = {
        user_id: userId,
        first_name: first_name,
        last_name: last_name,
        sport_id: sportId,
        group_id: groupId,
        campus_id: campus_id,
        created_at: new Date(),
      };

      await trx("students").insert(newStudent);

      let sportName = null;
      if (newUser.role_id === 3) {
        const sportData = await trx("students")
          .join("sports", "students.sport_id", "sports.id")
          .select("sports.name as sport_name")
          .where("students.user_id", "=", userId)
          .first();

        if (sportData) {
          sportName = sportData.sport_name;
        }
      }


      // Respond with success and user details
      res.status(201).json({
        user_id: userForToken.id,
        email_verified: userForToken.email_verified,
        email: userForToken.email,
        role: userForToken.role_id,
        sport: sportName,
      });
    });
  } catch (err) {
    console.error("POST /register/ transaction error:", err);
    res.status(500).json({
      error:
        "An error occurred while creating a new student user: " + err.message,
    });
  }
});


router.post("/new-email-verification", isAuthenticated, async (req, res) => {
  const user_id = req.user.user_id;
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
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeSinceLastToken < cooldownPeriod) {
        const remainingTime = cooldownPeriod - timeSinceLastToken;
        const waitTime = Math.ceil(remainingTime / 1000 / 60); // convert to minutes

        return res.status(429).json({
          message: `A reset email has already been sent recently. Please check your email or try again in ${waitTime} minute(s).`,
          wait_time: remainingTime, // in milliseconds
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

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

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

    refreshToken = createShortRefreshToken(user);
    accessToken = createAccessToken(user);

    let sportName = null;
    if (user.role_id === 3) {
      const sportData = await knex("students")
        .join("sports", "students.sport_id", "sports.id")
        .select("sports.name as sport_name")
        .where("students.user_id", "=", user.id)
        .first();

      if (sportData) {
        sportName = sportData.sport_name;
      }
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 12 * 60 * 60 * 1000, //12 hours
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, //15 minutes
    });

    res.json({
      user_id: user.id,
      email_verified: user.email_verified,
      email: user.email,
      role: user.role_id,
      sport: sportName,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

router.get("/check-for-otp", isAuthenticated, async (req, res) => {
  const userId = req.user.user_id;

  try {
    const tokenEntry = await knex("verification_otp")
      .where({ user_id: userId })
      .first();

    if (!tokenEntry) {
      return res.json({ value: false });
    }

    res.json({ value: true });
  } catch (error) {
    console.error("Error checking for OTP:", error);
    res.status(500).json({ message: "Error checking for OTP" });
  }
});

module.exports = router;
