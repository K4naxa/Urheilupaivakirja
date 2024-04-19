var express = require("express");
var router = express.Router();
var { getUserId } = require("../middleware/auth");

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Post a new journal entry
router.post("/", async (req, res, next) => {
  console.log(req.body);
  const entry = req.body;
  entry.user_id = getUserId(req);
  entry.created_at = new Date();

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
          // for new entries that are rest or sick days, always delete existing entries
          await trx("journal_entries")
            .where({
              user_id: entry.user_id,
              date: entry.date,
            })
            .del();
        }
      }

      // lastly, insert new entry
      const rows = await trx("journal_entries").insert(entry);
      return rows;
    });

    res.json(result);
    console.log(result);
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
  console.log(date);
  const user_id = getUserId(req);

  try {
    const rows = await knex("journal_entries")
      .select("*")
      .where({ user_id, date });
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.log("SELECT * FROM `journal_entries` failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
