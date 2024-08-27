var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

router.get("/entries", async (req, res) => {
  try {
    const role = getRole(req);

    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date1, date2 } = req.query;

    const allEntries = await knex("journal_entries")
      .select(
        "journal_entries.*",
        "journal_entry_types.name as entry_type_name",
        "workout_types.name as workout_type_name",
        "workout_categories.name as workout_category_name",
        "time_of_day.name as time_of_day_name",
        "workout_intensities.name as workout_intensity_name"
      )
      .whereBetween("journal_entries.date", [date1, date2])
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
      .leftJoin(
        "workout_intensities",
        "journal_entries.workout_intensity_id",
        "workout_intensities.id"
      );
    console.log(allEntries);
    res.json(allEntries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/new-students", async (req, res) => {
  try {
    const role = getRole(req);

    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date1, date2 } = req.query;

    const newStudents = await knex("students")
      .select("students.created_at")
      .whereBetween("students.created_at", [date1, date2])
      .where("students.verified", true)
      .leftJoin("users", "students.user_id", "users.id");

    res.json(newStudents);
  } catch (error) {
    console.error("Error fetching new student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
