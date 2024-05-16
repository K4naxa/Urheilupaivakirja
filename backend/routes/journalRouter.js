var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getUserId } = require("../middleware/auth");

const { getRole } = require("../middleware/auth");

router.get("/user", async (req, res, next) => {
  const user_id = getUserId(req);
  knex("journal_entries")
    .select(
      "journal_entries.id",
      "journal_entries.length_in_minutes",
      "journal_entries.date",
      "journal_entries.intensity",
      "journal_entries.details",
      "journal_entries.entry_type_id",
      "journal_entry_types.name as entry_type",
      "workout_types.name as workout_type",
      "workout_categories.name as workout_category",
      "time_of_day.name as time_of_day"
    )
    .where("journal_entries.user_id", "=", user_id)
    .join(
      "journal_entry_types",
      "journal_entries.entry_type_id",
      "journal_entry_types.id"
    )
    .leftJoin(
      "workout_types",
      "journal_entries.workout_type_id",
      "workout_types.id"
    )
    .leftJoin(
      "workout_categories",
      "journal_entries.workout_category_id",
      "workout_categories.id"
    )
    .leftJoin("time_of_day", "journal_entries.time_of_day_id", "time_of_day.id")
    .orderBy("journal_entries.date", "desc")
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.error("SELECT * FROM `journal_entries` failed", err);
      res.status(500).json({ error: err });
    });
});

// Get all journal entries
// TODO: IMPLEMENT PROPER AUTHENTICATION, NOW REQUIRES JUST A WORKING TOKEN
router.get("/", async (req, res, next) => {
  try {
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

// Get a single journal entry by journal_entry.id
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  knex("journal_entries")
    .select("*")
    .where("id", "=", id)
    .first()
    .then((row) => {
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      console.log("SELECT (with ID) FROM `journal_entries` failed", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
