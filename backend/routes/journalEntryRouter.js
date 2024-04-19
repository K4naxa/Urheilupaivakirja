var express = require("express");
var router = express.Router();
var { getUserId } = require("../middleware/auth");

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Post a new journal entry
router.post("/", async (req, res, next) => {
  console.log(req.body)
  const entry = req.body;
  entry.user_id = getUserId(req);
  entry.created_at = new Date();

  // if entry is a new workout
  if (entry.entry_type_id === "1") {
    try {
      const rows = await knex("journal_entries").insert(entry);
      res.json(rows);
    } catch (err) {
      console.log("INSERT INTO `journal_entries` failed", err);
      res.status(500).json({
        error: "An error occurred while creating a new journal entry.",
      });
    }
  }
  // if entry is a sick day or rest day
  else if (entry.entry_type_id === "2" || entry.entry_type_id === "3") {
    try {
      const result = await knex.transaction(async (trx) => {
        const conflicts = await trx("journal_entries").where({
          user_id: entry.user_id,
          date: entry.date,
        });

        if (conflicts.length > 0) {
          await trx("journal_entries")
            .where({
              user_id: entry.user_id,
              date: entry.date,
            })
            .del();
        }

        const rows = await trx("journal_entries").insert(entry);
        return rows;
      });

      //send back the result
      res.json(result);
      console.log(result)
    } catch (err) {
      console.log("Transaction failed", err);
      res.status(500).json({
        error: "An error occurred while processing your journal entry.",
      });
    }
  } else {
    res.status(400).json({ error: "Invalid entry type." });
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
      console.log(rows);
    res.json(rows);
  } catch (err) {
    console.log("SELECT * FROM `journal_entries` failed", err);
    res.status(500).json({ error: "Internal server error" });
  }


})

module.exports = router;
