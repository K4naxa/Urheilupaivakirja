var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const bcrypt = require("bcryptjs");

// Register a new student
router.post('/', async (req, res, next) => {
  const user = req.body;
  const saltRounds = 10;

  try {
    await knex.transaction(async (trx) => {
      // Hash the password
      const passwordHash = await bcrypt.hash(user.password, saltRounds);

      // Prepare new user data
      const newUser = {
        email: user.email,
        password: passwordHash,
        role_id: 3, // Default role for student
        email_verified: true, // TODO: Implement actual email verification
        created_at: new Date(),
      };

      // Insert the new user and get the id of the inserted user
      const [userId] = await trx("users").insert(newUser, "id");

      // Prepare new student data
      const newStudent = {
        user_id: userId,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        sport_id: user.sport_id,
        group_id: user.group_id,
        campus_id: user.campus_id,
        created_at: new Date(),
      };

      // Insert the new student
      await trx("students").insert(newStudent);

      // If everything is successful, send a success response
      res.status(201).json({ success: "Student user created successfully" });
    });
  } catch (err) {
    console.error("POST /user/register transaction error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new student user" });
  }
});

router.delete('/:id', async (req, res, next) => {
  //TODO: IMPLEMENT ADMIN AUTHENTICATION, NOW JUST FOR TESTING PURPOSES
  try {
    await knex.transaction(async (trx) => {
      await trx("students").where("user_id", req.params.id).del();

      await trx("users").where("id", req.params.id).del();

      res.status(200).json({ success: "Student user deleted successfully" });
    });
  } catch (err) {
    console.error("DELETE /user/register/:id transaction error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting a student user" });
  }
});

module.exports = router;
