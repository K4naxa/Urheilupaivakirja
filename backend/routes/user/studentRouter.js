const express = require("express");
const router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole } = require("../../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const students = await knex("students")
      .select(
        "students.user_id",
        "students.first_name",
        "students.last_name",
        "users.email",
        "sports.name as sport",
        "student_groups.group_identifier as group",
        "campuses.name as campus"
      )
      .where("students.archived", false)
      .leftJoin("users", "students.user_id", "users.id")
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

    if (students.length === 0) {
      return res.status(404).json({ error: "No students found" });
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if the user is a teacher and archive the student
router.put("/archive/:id", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const student = await knex("students")
      .where("id", "=", req.params.id)
      .update({ archived: true })
      .catch((error) => {
        console.error("Error archiving student:", error);
        return res.status(500).json({ error: "Internal server error" });
      });

    console.log("Student archived:", student);
    res.json(student);
  } catch (error) {
    console.error("Error archiving student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
