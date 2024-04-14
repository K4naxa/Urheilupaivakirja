var express = require("express");
var router = express.Router();
var { getUserId } = require("../middleware/auth");

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

// Post a new journal entry
router.post("/", async (req, res, next) => {
  const entry = req.body;
  entry.user_id = getUserId(req)
  entry.created_at = new Date();
  try {
    const rows = await knex("journal_entries").insert(entry);
    res.json(rows);
  } catch (err) {
    console.log("INSERT INTO `journal_entries` failed", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new journal entry." });
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

    const [journal_entry_types, workout_types, workout_categories, time_of_day] = data;

    res.json({ journal_entry_types, workout_types, workout_categories, time_of_day});
  } catch (err) {
    console.log("GET /journal_entry/options failed", err);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching journal entry options.",
      });
  }
});

module.exports = router;
