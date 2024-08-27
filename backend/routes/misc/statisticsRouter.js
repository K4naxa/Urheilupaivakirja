var express = require("express");
var router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware");

router.get("/entries", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const { date1, date2 } = req.query;

    // Query to fetch all necessary data and compute aggregates
    const results = await knex("journal_entries")
      .select(
        knex.raw('COUNT(DISTINCT journal_entries.student_id) AS studentCount'),
        knex.raw('COUNT(*) AS entryCount'),
        knex.raw('SUM(CASE WHEN journal_entries.entry_type_id = 1 THEN journal_entries.length_in_minutes ELSE 0 END) AS exerciseTimeMinutes')
      )
      .whereBetween("journal_entries.date", [date1, date2]);

    // Processing to format exercise time in hours and minutes
    const { studentCount, entryCount, exerciseTimeMinutes } = results[0];
    const hours = Math.floor(exerciseTimeMinutes / 60);
    const minutes = exerciseTimeMinutes % 60;
    const exerciseTimeFormatted = `${hours}h ${minutes}min`;

    // Send the processed data as response
    res.json({ studentCount, entryCount, exerciseTimeFormatted });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/new-students", isAuthenticated, isTeacher, async (req, res) => {
  try {
    const { date1, date2 } = req.query;

    if (!date1 || !date2) {
      return res.status(400).json({ error: "Both date1 and date2 are required" });
    }

    const countResult = await knex("students")
      .count('students.id as studentCount')  
      .whereBetween("students.created_at", [date1, date2])  // Filter by created_at between date1 and date2
      .andWhere("students.verified", true);

    if (countResult.length > 0) {
      const totalNewStudents = countResult[0].studentCount;
      res.json({ totalNewStudents });
    } else {
      // If no data found, return zero as count
      res.json({ totalNewStudents: 0 });
    }
  } catch (error) {
    console.error("Error fetching new student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
