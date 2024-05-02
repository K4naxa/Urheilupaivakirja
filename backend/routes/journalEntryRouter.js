var express = require("express");
var router = express.Router();
var { getUserId } = require("../middleware/auth");

const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')

dayjs.extend(utc)


const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Post a new journal entry
router.post("/", async (req, res, next) => {
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
      // check if conflicts
      if (conflicts.length > 0) {
        if (entry.entry_type_id == 1) {
          // check if all existing entries are exercises
          const allTypeOne = conflicts.every(
            (conflict) => conflict.entry_type_id == 1
          );

          if (!allTypeOne) {
            // if not all are exercises, delete existing entries. Multiple exercises on the same day are allowed.
            await trx("journal_entries")
              .where({
                user_id: entry.user_id,
                date: entry.date,
              })
              .del();
          }
        } else {
          // for rest or sick days, delete all existing entries
          await trx("journal_entries")
            .where({
              user_id: entry.user_id,
              date: entry.date,
            })
            .del();
        }
      }

      // insert entry after handling possible conflicts
      const rows = await trx("journal_entries").insert(entry);
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

router.get("/options", async (req, res, next) => {
  try {
    const data = await Promise.all([
      knex("journal_entry_types").select("*"),
      knex("workout_types").select("*"),
      knex("workout_categories").select("*"),
      knex("time_of_day").select("*"),
    ]);

    const [
      journal_entry_types,
      workout_types,
      workout_categories,
      time_of_day,
    ] = data;

    res.json({
      journal_entry_types,
      workout_types,
      workout_categories,
      time_of_day,
    });
  } catch (err) {
    console.log("GET /journal_entry/options failed", err);
    res.status(500).json({
      error: "An error occurred while fetching journal entry options.",
    });
  }
});

router.get("/date/:date", async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await knex("journal_entries")
      .select([
        "id as entry_id",
        "entry_type_id as entry_type",
        "workout_type_id as workout_type",
        "workout_category_id as workout_category",
        "length_in_minutes",
        "time_of_day_id as time_of_day",
        "intensity",
        "date",
        "details",
      ])
      .where("id", id)
      .first();
    res.json(data);
  } catch (err) {
    console.log("GET /journal_entry/:id failed", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching a journal entry." });
  }
});

// Update a journal entry
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const entry = req.body;
  entry.updated_at = new Date();

  try {
    await knex.transaction(async (trx) => {
      // Check if the entry exists
      const existingEntry = await trx("journal_entries")
        .where("id", id)
        .first();

      if (!existingEntry) {
        throw new Error("Entry not found.");
      }

      // check for conflicts (entries on the same day) except for the entry being updated
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
            // if not all are exercises, delete existing entries. Multiple exercises on the same day are allowed.
            await trx("journal_entries")
              .where({
                user_id: entry.user_id || existingEntry.user_id,
                date: entry.date || existingEntry.date,
              })
              .andWhereNot("id", id)
              .del();
          }
        } else {
          // for rest or sick days, delete all existing conflicting entries
          await trx("journal_entries")
            .where({
              user_id: entry.user_id || existingEntry.user_id,
              date: entry.date || existingEntry.date,
            })
            .andWhereNot("id", id)
            .del();
        }
      }

      // update entry after handling possible conflicts
      const rows = await trx("journal_entries").where("id", id).update(entry);
      return rows;
    });

    res.json({ message: "Entry updated successfully" });
  } catch (err) {
    console.log("PUT /journal_entry/:id failed", err);
    res.status(500).json({
      error: "An error occurred while updating a journal entry.",
    });
  }
});

// Delete a journal entry
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  //TODO: Check if the user is authorized to delete the entry
  try {
    const rows = await knex("journal_entries").where("id", id).del();
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.log("DELETE /journal_entry/:id failed", err);
    res.status(500).json({
      error: "An error occurred while deleting a journal entry.",
    });
  }
});

module.exports = router;
