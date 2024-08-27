var express = require("express");
var router = express.Router();

const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getUserId } = require("../../utils/authMiddleware");

// "/" --------------------------------------------

// Get all the dropdown options for journal entry modal (add/edit)
router.get("/options", async (req, res, next) => {
  try {
    const data = await Promise.all([
      knex("journal_entry_types").select("*"),
      knex("workout_types").select("*"),
      knex("workout_categories").select("*"),
      knex("time_of_day").select("*"),
      knex("workout_intensities").select("*"),
    ]);

    const [
      journal_entry_types,
      workout_types,
      workout_categories,
      time_of_day,
      workout_intensities,
    ] = data;

    res.json({
      journal_entry_types,
      workout_types,
      workout_categories,
      time_of_day,
      workout_intensities,
    });
  } catch (err) {
    console.log("GET /journal_entry/options failed", err);
    res.status(500).json({
      error: "An error occurred while fetching journal entry options.",
    });
  }
});

// "/user" --------------------------------------------

// get all users own journal entries
router.get("/user", async (req, res, next) => {
  try {
    const user_id = getUserId(req);
    const rows = await knex("journal_entries")
      .select(
        "journal_entries.*",
        "journal_entry_types.name as entry_type_name",
        "workout_types.name as workout_type_name",
        "workout_categories.name as workout_category_name",
        "time_of_day.name as time_of_day_name",
        "workout_intensities.name as workout_intensity_name"
      )
      .where("journal_entries.user_id", user_id)
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
      )
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
    const allEntries = await knex("journal_entries")
      .select(
        "journal_entries.id",
        "journal_entries.length_in_minutes",
        "journal_entries.date",
        "journal_entries.details",
        "journal_entries.entry_type_id",
        "workout_intensities.name as workout_intensity_name",
        "journal_entry_types.name as entry_type_name",
        "workout_types.name as workout_type_name",
        "workout_categories.name as workout_category_name",
        "time_of_day.name as time_of_day_name"
      )
      .where("journal_entries.user_id", user_id)
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
      )
      .orderBy("journal_entries.date", "desc");

    // Get student information
    const studentInfo = await knex("students")
      .select(
        "students.user_id",
        "students.first_name",
        "students.last_name",
        "sports.name as sport_name",
        "student_groups.name",
        "campuses.name as campus_name"
      )
      .where("students.user_id", user_id)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id")
      .first();

    // Map all students to include their journal entries
    if (studentInfo) {
      const response = {
        user_id: studentInfo.user_id,
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        sport_name: studentInfo.sport_name,
        name: studentInfo.name,
        campus_name: studentInfo.campus_name,
        journal_entries: allEntries,
      };

      res.json(response);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

//get all users own journal entries by date
router.get("/user/:date", async (req, res, next) => {
  const date = req.params.date;
  const user_id = getUserId(req);

  try {
    const rows = await knex("journal_entries")
      .select("*")
      .where({ user_id, date });
    res.json(rows);
  } catch (err) {
    console.log("SELECT * FROM `journal_entries` failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// "/entry/" --------------------------------------------

// Post a new journal entry
router.post("/entry/", async (req, res, next) => {
  const entry = req.body;

  entry.user_id = getUserId(req);

  entry.created_at = new Date();

  entry.date = new Date(entry.date);
  entry.date.setUTCHours(0, 0, 0, 0);

  try {
    const result = await knex.transaction(async (trx) => {
      // get entries for the date, called conflicts
      const conflicts = await trx("journal_entries").where({
        user_id: entry.user_id,
        date: entry.date,
      });

      let deletedEntriesCount = 0;

      // check if conflicts
      if (conflicts.length > 0) {
        if (entry.entry_type_id == 1) {
          // check if all existing entries are exercises
          const allTypeOne = conflicts.every(
            (conflict) => conflict.entry_type_id == 1
          );

          if (!allTypeOne) {
            // if not all are exercises, delete existing entries. Multiple exercises on the same day are allowed.
            deletedEntriesCount += await trx("journal_entries")
              .where({
                user_id: entry.user_id,
                date: entry.date,
              })
              .del();
          }
        } else {
          // for rest or sick days, delete all existing entries
          deletedEntriesCount += await trx("journal_entries")
            .where({
              user_id: entry.user_id,
              date: entry.date,
            })
            .del();
        }
      }

      if (deletedEntriesCount > 0) {
        await trx("students")
          .where({ user_id: entry.user_id })
          .decrement("total_entry_count", deletedEntriesCount);
      }

      // insert entry after handling possible conflicts
      const rows = await trx("journal_entries").insert(entry);

      // increment total_entry_count for the user
      await trx("students")
        .where({ user_id: entry.user_id })
        .increment("total_entry_count", 1);

      return rows;
    });

    res.json(result);
  } catch (err) {
    console.log("Transaction failed", err);
    res.status(500).json({
      error: "An error occurred while processing your journal entry.",
    });
  }
});

// Get a single journal entry by journal_entry.id
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await knex("journal_entries")
      .select([
        "id as entry_id",
        "entry_type_id",
        "workout_type_id",
        "workout_category_id",
        "length_in_minutes",
        "time_of_day_id",
        "workout_intensity_id",
        "date",
        "details",
      ])
      .where("id", id)
      .first();

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (err) {
    console.log("GET /journal_entry/:id failed", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching a journal entry." });
  }
});

router.put("/entry/:id", async (req, res, next) => {
  const id = req.params.id;
  const entry = req.body;

  entry.date = new Date(entry.date);
  entry.date.setUTCHours(0, 0, 0, 0);
  entry.updated_at = new Date();

  try {
    await knex.transaction(async (trx) => {
      // Check if the entry exists
      const existingEntry = await trx("journal_entries")
        .where("id", id)
        .first();

      if (!existingEntry) {
        return res.status(404).json({ error: "Entry not found." });
      }

      // Check for conflicts (entries on the same day) except for the entry being updated
      const conflicts = await trx("journal_entries")
        .where({
          user_id: entry.user_id || existingEntry.user_id,
          date: entry.date || existingEntry.date,
        })
        .andWhereNot("id", id);

      if (conflicts.length > 0) {
        if (entry.entry_type_id == 1) {
          const allTypeOne = conflicts.every(
            (conflict) => conflict.entry_type_id == 1
          );

          if (!allTypeOne) {
            // If not all are exercises, delete existing entries. Multiple exercises on the same day are allowed.
            await trx("journal_entries")
              .where({
                user_id: entry.user_id || existingEntry.user_id,
                date: entry.date || existingEntry.date,
              })
              .andWhereNot("id", id)
              .del();
          }
        } else {
          // For rest or sick days, delete all existing conflicting entries
          await trx("journal_entries")
            .where({
              user_id: entry.user_id || existingEntry.user_id,
              date: entry.date || existingEntry.date,
            })
            .andWhereNot("id", id)
            .del();
        }
      }

      // Update entry after handling possible conflicts
      const rows = await trx("journal_entries").where("id", id).update(entry);

      if (rows === 0) {
        throw new Error("Failed to update entry.");
      }

      return rows;
    });

    res.json({ message: "Entry updated successfully" });
  } catch (err) {
    console.error("PUT /:id failed", err);
    res.status(500).json({
      error: "An error occurred while updating a journal entry.",
    });
  }
});

// Delete a journal entry
router.delete("/entry/:id", async (req, res, next) => {
  const id = req.params.id;
  //TODO: Check if the user is authorized to delete the entry
  try {
    const rows = await knex("journal_entries").where("id", id).del();

    // decrement total_entry_count for the user
    await knex("students")
      .where({ user_id: getUserId(req) })
      .decrement("total_entry_count", 1);

    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.log("DELETE /journal_entry/:id failed", err);
    res.status(500).json({
      error: "An error occurred while deleting a journal entry.",
    });
  }
});

module.exports = router;
