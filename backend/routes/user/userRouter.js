var express = require("express");
var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const saltRounds = config.BCRYPTSALT;
const sendEmail = require("../../utils/email/sendEmail");
const otpGenerator = require("otp-generator");
const { getRole, getUserId, createToken } = require("../../middleware/auth");

//delete self / delete own account -- POST instead of DELETE for password verification (delete has no body)
router.post("/self", async (req, res) => {
  const user_id = getUserId(req);
  const password = req.body.password;
  const user = await knex("users").where({ id: user_id }).first();
  console.log("User data:", user);

  if (user && (user.role_id === 2 || user.role_id === 3)) {
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        await knex("users").where("id", "=", user_id).delete();
        return res.status(200).json({ message: "User deleted" });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error during authentication or deletion:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// admin/teacher delete for spectators and students
router.delete("/:id", async (req, res) => {
  const userIdToDelete = Number(req.params.id);

  if (getRole(req) === 1) {
    try {
      await knex("users").where("id", "=", userIdToDelete).delete();
      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// verify user password
router.post("/verify-password", async (req, res) => {
  const userId = getUserId(req);
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await knex("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Error verifying password" });
  }
});

// admin/teacher delete for teachers (admin cannot be deleted)
router.delete("/teacher/:id", async (req, res) => {
  const userIdToDelete = Number(req.params.id);
  if (getRole(req) === 1) {
    try {
      const targetUser = await knex("users")
        .where("id", "=", userIdToDelete)
        .first();
      if (targetUser.role_id === 1) {
        const isAdmin = await knex("teachers")
          .where("user_id", "=", userIdToDelete)
          .andWhere("is_admin", true)
          .first();
        if (isAdmin) {
          return res.status(403).json({ error: "Cannot delete the admin" });
        }
      }
      await knex("users").where("id", "=", userIdToDelete).delete();
      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error("Error attempting to delete user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/new-email-verification", async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

router.post("/verify-email", async (req, res) => {
  let userId;
  try {
    userId = getUserId(req);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
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

router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // does user exist?
    const user = await knex("users").where({ email }).first();
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

    const existingToken = await knex("password_reset_otp")
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
    await knex("password_reset_otp").where({ user_id: user.id }).del();

    const resetOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const OTP_hash = await bcrypt.hash(resetOTP, Number(saltRounds));

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hours

    // store the new token in the database
    await knex("password_reset_otp").insert({
      user_id: user.id,
      otp_hash: OTP_hash,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    sendEmail(
      user.email,
      "Password Reset Request",
      { name: firstName, otp: resetOTP },
      "./template/requestResetPassword.handlebars"
    );

    res.json({
      message: "Reset token generated and sent to your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating reset token" });
  }
});

router.put("/change-password", async (req, res) => {
  const userId = getUserId(req);
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await knex("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hash = await bcrypt.hash(newPassword, Number(saltRounds));

    await knex("users").where({ id: userId }).update({ password: hash });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

router.post("/verify-password-reset", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "Email address not recognized." });
    }

    const tokenEntry = await knex("password_reset_otp")
      .where({ user_id: user.id })
      .first();

    if (!tokenEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    const isTokenValid = await bcrypt.compare(otp, tokenEntry.otp_hash);
    const isTokenExpired = new Date() > new Date(tokenEntry.expires_at);

    if (!isTokenValid || isTokenExpired) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    await knex("password_reset_token").where({ user_id: user.id }).del();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(saltRounds));

    await knex("password_reset_token").insert({
      user_id: user.id,
      token_hash: hash,
      expires_at: new Date(Date.now() + 10 * 60000), //10min
    });

    res.json({ message: "OTP verified successfully", resetToken });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "Email address not recognized." });
    }

    const tokenData = await knex("password_reset_token")
      .where({ user_id: user.id })
      .first();

    if (!tokenData) {
      return res.status(404).json({ message: "No token found" });
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return res
        .status(401)
        .json({ message: "Invalid token or token has expired" });
    }

    const isTokenValid = await bcrypt.compare(resetToken, tokenData.token_hash);

    if (!isTokenValid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const hash = await bcrypt.hash(newPassword, Number(saltRounds));

    await knex("users").where({ id: user.id }).update({ password: hash });
    await knex("password_reset_token").where({ user_id: user.id }).del();

    res.json({ message: "Your password has been successfully reset." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

router.get("/profiledata", async (req, res) => {
  try {
    if (getRole(req) !== 1 && getRole(req) !== 2) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const role = getRole(req);
    const userId = getUserId(req);

    const userData = await knex("users")
      .select("id", "email", "created_at")
      .where("id", userId);

    const userNames =
      role === 2
        ? await knex("spectators")
            .select("first_name", "last_name")
            .where("user_id", userId)
        : await knex("teachers")
            .select("first_name", "last_name")
            .where("user_id", userId);
    const combined = userData.map((user) => {
      const spectator = userNames.find((s) => s.id === user.user_id);
      return { ...user, ...spectator };
    });
    res.json(combined[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
