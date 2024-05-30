const express = require("express");
const router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const { getRole, getUserId } = require("../../middleware/auth");

// TODO: Default "get" for student route shouldn't include journal entries
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
      .where("archived", false)
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

// Get all students and the names of their sport, group, campus and all journal entries
router.get("/entries", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all journal entries
    const allEntries = await knex("journal_entries")
      .select(
        "journal_entries.*",
        "journal_entry_types.name as entry_type_name",
        "workout_types.name as workout_type_name",
        "workout_categories.name as workout_category_name",
        "time_of_day.name as time_of_day_name",
        "workout_intensities.name as workout_intensity_name"
      )
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

    // Fetch all students with their associated sports, groups, and campus information
    const allStudents = await knex("students")
      .select(
        "students.user_id",
        "students.first_name",
        "students.last_name",
        "sports.name as sport_name",
        "student_groups.group_identifier",
        "campuses.name as campus_name"
      )
      .where("students.archived", false)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id")
      .orderBy("students.last_name", "asc");

    const studentEntries = allStudents.map((student) => ({
      user_id: student.user_id,
      first_name: student.first_name,
      last_name: student.last_name,
      sport_name: student.sport_name,
      group_identifier: student.group_identifier,
      campus_name: student.campus_name,
      journal_entries: allEntries.filter(
        (entry) => entry.user_id === student.user_id
      ),
    }));

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

    // Get all journal entries
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
      .where("archived", true)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

    res.json(allStudents);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Check if the user is a teacher and archive the student
router.put("/archive/:id", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const studentUserId = req.params.id;
    const student = await knex("students")
      .where("user_id", "=", studentUserId)
      .first();

    if (!student) {
      console.log(`Student not found: ${studentUserId}`);
      return res.status(404).json({ error: "Student not found" });
    }

    const newArchivedStatus = !student.archived;
    await knex("students")
      .where("user_id", studentUserId)
      .update({ archived: newArchivedStatus });

    return res.json({
      message: "Student archived status updated successfully",
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

// Get student data
router.get("/data", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 3 && role !== 1) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = getUserId(req);
    const student = await knex("students")
      .select(
        "students.*",
        "sports.name as sport_name",
        "student_groups.group_identifier",
        "campuses.name as campus_name",
        "users.email",
        "users.created_at",
        "users.id as user_id"
      )
      .where("user_id", userId)
      .first()
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id")
      .leftJoin("users", "students.user_id", "users.id");

    const journalData = await knex("journal_entries")
      .select(
        knex.raw("COUNT(DISTINCT DATE(date)) as unique_days_count"),
        knex.raw(
          "COUNT(CASE WHEN entry_type_id = 1 THEN 1 END) as entry_type_1_count"
        ),
        knex.raw("COUNT(*) as total_entries_count")
      )
      .where("user_id", userId)
      .first();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentData = {
      ...student,
      unique_days_count: journalData.unique_days_count,
      entry_type_1_count: journalData.entry_type_1_count,
      total_entries_count: journalData.total_entries_count,
    };

    res.json(studentData);
  } catch (error) {
    console.error("Error fetching student data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
