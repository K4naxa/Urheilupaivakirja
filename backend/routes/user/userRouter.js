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
const {
  getRole,
  getUserId,
  createToken,
  isTeacherOrSpectator,
} = require("../../utils/authMiddleware");
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");

// For user themselves -------------------------------------------------------------------

// ---- Forgotten password ----
// Step #1: Request password reset
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

// Step #2: Verify with OTP from email
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

// Step #3: Replace password with new password
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

// ---- User self change password ----
router.put("/change-password", isAuthenticated, async (req, res) => {
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

// ---- User self deletion ----

//delete self with password confirmation -- POST instead of DELETE for password verification (delete has no body)
router.post("/delete/self", isAuthenticated, async (req, res) => {
  const user_id = res.user.user_id;
  const password = req.body.password;
  const user = await knex("users").where({ id: user_id }).first();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

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
});

// verify user password (used to check if user can delete their account)
router.post("/verify-password", isAuthenticated, async (req, res) => {
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

// FOR TEACHERS (ADMINS) -------------------------------------------------------------------

router.delete("/delete/:id", isAuthenticated, isTeacher, async (req, res) => {
  const userIdToDelete = Number(req.params.id);

  if (!userIdToDelete) {
    return res.status(400).json({ error: "Invalid user ID provided." });
  }

  try {
    const user = await knex("users").where("id", "=", userIdToDelete).first();
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user to be deleted is either a student or a spectator
    if (user.role_id !== 2 && user.role_id !== 3) {
      return res.status(403).json({ error: "Unauthorized to delete this user type." });
    }

    await knex("users").where("id", "=", userIdToDelete).delete();
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// delete teacher user
router.delete("/delete/teacher/:id", isAuthenticated, isTeacher, async (req, res) => {
  const userIdToDelete = Number(req.params.id);

  try {
    const targetUser = await knex("users")
      .where("id", "=", userIdToDelete)
      .first();
    
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (targetUser.role_id !== 1) {
      return res.status(403).json({ error: "Can only delete teacher users" });
    }

    const isAdmin = await knex("teachers")
      .where("user_id", "=", userIdToDelete)
      .andWhere("is_admin", true)
      .first();

    if (isAdmin) {
      return res.status(403).json({ error: "Cannot delete an admin" });
    }

    await knex("users").where("id", "=", userIdToDelete).delete();
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error attempting to delete user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/profile", isAuthenticated, isTeacherOrSpectator, async (req, res) => {
  try {
    const userId = req.user.user_id

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
