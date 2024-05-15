const express = require("express");
const router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole, getUserId } = require("../../middleware/auth");

// Get all students and the names of their sport, group and campus
router.get("/", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all journal entries
    const allEntries = await knex.select("*").from("journal_entries");
    // Get all students
    const allStudents = await knex
      .select(
        "user_id",
        "first_name",
        "last_name",
        "sports.name as sport",
        "student_groups.group_identifier",
        "campuses.name as campus"
      )
      .from("students")
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

    // Map all students to include their journal entries
    const studentEntries = allStudents.map((student) => {
      const studentJournalEntries = allEntries.filter(
        (entry) => entry.user_id === student.user_id
      );
      return {
        user_id: student.user_id,
        first_name: student.first_name,
        last_name: student.last_name,
        sport: student.sport,
        group: student.group_identifier,
        campus: student.campus,
        journal_entries: studentJournalEntries,
      };
    });

    res.json(studentEntries);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get all archived students
router.get("/archived", async (req, res) => {
  console.log("Getting archived students");
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const students = await knex("students")
      .select(
        "students.id",
        "students.user_id",
        "students.first_name",
        "students.last_name",
        "users.email",
        "sports.name as sport",
        "student_groups.group_identifier as group",
        "campuses.name as campus"
      )
      .where("students.archived", true)
      .leftJoin("users", "students.user_id", "users.id")
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

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

    await knex("students")
      .where("id", "=", req.params.id)
      .first() // Retrieve the first matching student
      .then(async (student) => {
        if (!student) {
          console.log("Student not found" + req.params.id);
          return res.status(404).json({ error: "Student not found" });
        }

        // Toggle the 'archived' status
        const newArchivedStatus = !student.archived;

        // Update the 'archived' status to the new value
        await knex("students")
          .where("id", "=", req.params.id)
          .update({ archived: newArchivedStatus });

        return res.json({
          message: "Student archived status updated successfully",
        });
      })
      .catch((error) => {
        console.error("Error toggling archived status:", error);
        return res.status(500).json({ error: "Internal server error" });
      });
  } catch (error) {
    console.error("Error toggling archived status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update student.news_last_viewed_at

router.put("/news", async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await knex("students")
      .where({ user_id: user_id })
      .update({ news_last_viewed_at: new Date() });

    return res.json({ message: "News last viewed at updated successfully" });
  } catch (error) {
    console.error("Error updating news last viewed at:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
