var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getUserId } = require("../middleware/auth");

const { getRole } = require("../middleware/auth");

router.get("/user", async (req, res, next) => {
  try {
    const user_id = getUserId(req);
    const rows = await knex('journal_entries')
      .select(
        'journal_entries.*',
        'journal_entry_types.name as entry_type_name',
        'workout_types.name as workout_type_name',
        'workout_categories.name as workout_category_name',
        'time_of_day.name as time_of_day_name',
        'workout_intensities.name as workout_intensity_name'
      )
      .where('journal_entries.user_id', user_id)
      .leftJoin('journal_entry_types', 'journal_entries.entry_type_id', 'journal_entry_types.id')
      .leftJoin('workout_types', 'journal_entries.workout_type_id', 'workout_types.id')
      .leftJoin('workout_categories', 'journal_entries.workout_category_id', 'workout_categories.id')
      .leftJoin('time_of_day', 'journal_entries.time_of_day_id', 'time_of_day.id')
      .leftJoin('workout_intensities', 'journal_entries.workout_intensity_id', 'workout_intensities.id')
      .orderBy("journal_entries.date", "desc");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching user journal entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




//get all user journals by id for Teacher
router.get("/user/:id", async (req, res, next) => {
  const user_id = req.params.id;
  try {
    // Get all journal entries along with related information
    const allEntries = await knex
      .select(
        "journal_entries.id",
        "journal_entries.length_in_minutes",
        "journal_entries.date",
        "journal_entries.workout_intensity",
        "journal_entries.details",
        "journal_entries.entry_type_id",
        "journal_entry_types.name as entry_type",
        "workout_types.name as workout_type",
        "workout_categories.name as workout_category",
        "time_of_day.name as time_of_day"
      )
      .from("journal_entries")
      .where("user_id", "=", user_id)
      .leftJoin(
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
      .leftJoin(
        "time_of_day",
        "journal_entries.time_of_day_id",
        "time_of_day.id"
      )
      .orderBy("journal_entries.date", "desc");

    // Get student information
    const studentInfo = await knex
      .select(
        "user_id",
        "first_name",
        "last_name",
        "sports.name as sport",
        "student_groups.group_identifier",
        "campuses.name as campus"
      )
      .from("students")
      .where("user_id", "=", user_id)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

    console.log(studentInfo);

    // Map all students to include their journal entries
    const student = studentInfo.map((info) => ({
      user_id: info.user_id,
      first_name: info.first_name,
      last_name: info.last_name,
      sport: info.sport,
      group: info.group_identifier,
      campus: info.campus,
      journal_entries: allEntries,
    }));

    res.json(student[0]);
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
