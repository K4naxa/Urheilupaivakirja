var express = require("express");
var express = require("express");
var router = express.Router();
const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const frontendUrl = config.FRONTEND_URL;

const bcrypt = require("bcryptjs");
const saltRounds = config.BCRYPTSALT;
const crypto = require("crypto");
const { getUserFullName } = require("../../utils/library");

const sendEmail = require("../../utils/email/sendEmail");
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");
const { email, newPassword, first_name, last_name } = require("../../utils/validation");
const { validationResult } = require("express-validator");
const { refreshToken, accessToken } = require("../../utils/token");

// Get all spectators
router.get("/", isAuthenticated, isTeacher, async (req, res) => {
  try {
    // get spectators with their user info
    const spectators = await knex("users")
      .join("spectators", "users.id", "=", "spectators.user_id")
      .select(
        "users.id",
        "users.email",
        "users.created_at",
        "users.email_verified",
        "users.last_login_at",
        "spectators.first_name",
        "spectators.last_name"
      )
      .where("users.role_id", 2);
    res.json(spectators);
  } catch (err) {
    console.error("Error fetching spectators:", err);
    res.status(500).json({ message: err.message });
  }
});

// Admin invites a spectator
router.post("/invite", isAuthenticated, isTeacher, email, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  // check if user with the same email already exists
  try {
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check if user is already invited
    const existingInvitation = await knex("invited_spectators")
      .where({ email })
      .first();
    if (existingInvitation) {
      return res.status(400).json({ message: "User is already invited" });
    }

    // Generate a token for the user

    let invitationToken = crypto.randomBytes(32).toString("hex");
    const invitationTokenHash = await bcrypt.hash(
      invitationToken,
      Number(saltRounds)
    );
    const newSpectator = {
      email,
      token_hash: invitationTokenHash,
      expires_at: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7), // 1 week
    };

    console.log("newSpectator", newSpectator);

    var sendersName;
    try {
      sendersName = await getUserFullName(req.user.user_id);
    } catch (error) {
      console.error("Failed to get full name:", error);
    }

    await knex("invited_spectators").insert(newSpectator);

    const link = `${frontendUrl}/vierailijan-rekisterointi?token=${invitationToken}&email=${email}`;
    sendEmail(
      email,
      "Urheilupäiväkirja - Kutsu",
      { name: sendersName, link },
      "./template/inviteSpectator.handlebars"
    );

    res.json({ message: "Spectator invited" });
  } catch (error) {
    console.error("Error inviting spectator:", error);
    res.status(500).json({ message: "Error inviting spectator" });
  }
});

// Spectator registration
router.post(
  "/register",
  email,
  newPassword,
  first_name,
  last_name,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const spectator = req.body;

    // Input validation
    if (!spectator.token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await knex.transaction(async (trx) => {
        // Check if the email already exists in the users table
        const existingUser = await trx("users")
          .where({ email: spectator.email })
          .first();
        if (existingUser) {
          return res.status(409).json({ error: "Email already in use" });
        }

        // Retrieve the token hash for the specific email from the invited_spectators table
        const tokenRecord = await trx("invited_spectators")
          .select("token_hash", "expires_at")
          .where({ email: spectator.email })
          .first();

        if (!tokenRecord) {
          return res
            .status(400)
            .json({ error: "No invitation token found for this email" });
        }

        // Check if the token has expired
        if (new Date() > new Date(tokenRecord.expires_at)) {
          await trx("invited_spectators")
            .where({ email: spectator.email })
            .del();
          return res
            .status(410)
            .json({ error: "Invitation token has expired" });
        }

        // Verify the provided token against the stored hash
        const tokenIsValid = await bcrypt.compare(
          spectator.token,
          tokenRecord.token_hash
        );
        if (!tokenIsValid) {
          return res.status(400).json({ error: "Invalid invitation token" });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(
          spectator.password,
          Number(saltRounds)
        );

        const newUser = {
          email: spectator.email,
          password: passwordHash,
          role_id: 2, // role for spectator
          email_verified: 1,
          created_at: new Date(),
        };

        // Insert the new user
        const [userId] = await trx("users").insert(newUser);

        const newSpectator = {
          user_id: userId,
          first_name: spectator.first_name,
          last_name: spectator.last_name,
          created_at: new Date(),
        };

        // Insert the new spectator details
        await trx("spectators").insert(newSpectator);

        // delete used invitation token
        await trx("invited_spectators").where({ email: spectator.email }).del();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 5 * 60 * 1000,
        });

        res.status(201).json({
          user_id: userId,
          email_verified: newUser.email_verified,
          email: newUser.email,
          role: newUser.role_id,
          sport: null,
        });
      });
    } catch (err) {
      console.error("POST /register transaction error:", err);
      res.status(500).json({
        error:
          "An error occurred while creating a new spectator: " + err.message,
      });
    }
  }
);

router.get("/invited", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const invitedSpectators = await knex("invited_spectators").select(
      "id",
      "email",
      "created_at",
      "expires_at"
    );

    res.json(invitedSpectators);
  } catch (err) {
    console.error("Error fetching invited spectators:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/revoke/:id", isAuthenticated, isTeacher, async (req, res) => {
  const id = req.params.id;

  try {
    await knex("invited_spectators").where({ id }).del();
  } catch (err) {
    console.error("Error revoking invitation token:", err);
    res.status(500).json({ message: err.message });
  } finally {
    res.json({ message: "Invitation revoked" });
  }
});
module.exports = router;
