var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const saltRounds = config.BCRYPTSALT;
const { createToken } = require("../../utils/authMiddleware");
const { isAuthenticated } = require("../../utils/authMiddleware");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../utils/email/sendEmail");
const { validationResult } = require("express-validator");
const { email, newPassword } = require("../../utils/validation");

// Register a new student
router.post("/", [email, newPassword], async (req, res, next) => {
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

  function formatName(name) {
    return name
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .toLowerCase() 
      .split("-") // Split by - 
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1); // Capitalize the first letter of each part
      })
      .join("-"); // Join the parts back together with -
  }

  function formatNameWithCommas(name) {
    return name
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .toLowerCase()
      .split(",")
      .map((part) => {
        return part
          .trim() // Trim spaces around each part after splitting by ,
          .split(" ") // Split by spaces to handle each word individually
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(" "); // Join words back with a single space between them
      })
      .join(", "); // Join the parts back together with , and space
  }

  console.log(req.body);
  try {
    await knex.transaction(async (trx) => {
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

      const formated_first_name = formatName(first_name);
      const formated_last_name = formatName(last_name);

      async function checkIfNew(tableName, id) {
        // Check if the ID already exists in the table
        const existingId = await trx
          .select("id")
          .from(tableName)
          .where("id", id)
          .first();

        if (!existingId) {
          // Check if the name matches any existing entry
          const existingName = await trx
            .select("id")
            .from(tableName)
            .where("name", id) // Assume "id" is the name being checked
            .first();

          // If a matching name exists, return the corresponding ID
          if (existingName) {
            return existingName.id;
          }
          
          // "id" is in reality a name, so format it to handle commas
          trimmedName = formatNameWithCommas(id);
          const [newId] = await trx(tableName).insert({
            name: id, // Insert the "id" as the "name" in the table
            created_by: formated_first_name + " " + formated_last_name,
          });

          return newId;
        }

        // If the ID exists, return the existing ID
        return id;
      }



      // Insert the new user and get the id of the inserted user
      const [userId] = await trx("users").insert(newUser);

      // Check and insert sport, and student group if value/id is new
      const sportId = await checkIfNew("sports", sport_id);
      const groupId = await checkIfNew("student_groups", group_id);

      // Prepare new student data
      const newStudent = {
        user_id: userId,
        first_name: formated_first_name,
        last_name: formated_last_name,
        sport_id: sportId,
        group_id: groupId,
        campus_id: campus_id,
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
