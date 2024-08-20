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
    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all students
    const allStudents = await knex
      .select(
        "user_id",
        "first_name",
        "last_name",
        "sports.name as sport_name",
        "student_groups.name as group_name",
        "campuses.name as campus_name",
        "sport_id ",
        "group_id",
        "campus_id",
        "total_entry_count"
      )
      .from("students")
      .where("archived", false)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id");

    // Map all students to include their journal entries

    res.json(allStudents);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get all archived students
router.get("/archived", async (req, res) => {
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
        "student_groups.name",
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
  console.log("update news last viewed at");
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
router.get("/data/:userId?", async (req, res) => {
  try {
    // Retrieve the role of the user making the request
    const role = getRole(req);

    // Retrieve the user ID from the request
    const userId = role === 3 ? getUserId(req) : req.params.userId;

    // Fetch the student information from the database
    const student = await knex("students")
      .select(
        "students.*",
        "sports.name as sport_name",
        "student_groups.name",
        "campuses.name as campus_name",
        "users.email",
        "users.created_at",
        "users.id as user_id"
      )
      .where("user_id", userId) // Match the user ID
      .first() // Get the first match (should be only one)
      .leftJoin("sports", "students.sport_id", "sports.id")
      .leftJoin("student_groups", "students.group_id", "student_groups.id")
      .leftJoin("campuses", "students.campus_id", "campuses.id")
      .leftJoin("users", "students.user_id", "users.id");

    // Fetch journal entries and perform aggregations
    const journalData = await knex("journal_entries")
      .select(
        knex.raw("COUNT(DISTINCT DATE(date)) as unique_days_count"), // Count unique days with entries
        knex.raw(
          "COUNT(CASE WHEN entry_type_id = 1 THEN 1 END) as entry_type_1_count" // Count entries of type 1
        ),
        knex.raw("COUNT(*) as total_entries_count"), // Count total entries
        knex.raw("CAST(SUM(length_in_minutes) AS UNSIGNED) as total_minutes") // Sum total minutes
      )
      .where("user_id", userId) // Match the user ID
      .first(); // Get the first match

    // If no student is found, return a 404 response
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const journals = await knex("journal_entries")
      .select(
        "journal_entries.*",
        "journal_entry_types.name as entry_type_name",
        "workout_types.name as workout_type_name",
        "workout_categories.name as workout_category_name",
        "time_of_day.name as time_of_day_name",
        "workout_intensities.name as workout_intensity_name"
      )
      .where("journal_entries.user_id", userId)
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

    // Combine student and journal data into a single response object
    const studentData = {
      ...student, // Spread operator to include all student fields
      journal_entries: journals, // Add journal entries
      unique_days_count: journalData.unique_days_count, // Add unique days count
      entry_type_1_count: journalData.entry_type_1_count, // Add entry type 1 count
      total_entries_count: journalData.total_entries_count, // Add total entries count
      total_minutes: journalData.total_minutes, // Add total minutes
    };

    // Send the combined data as a JSON response
    res.json(studentData);
  } catch (error) {
    // Log the error and return a 500 response
    console.error("Error fetching student data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/entries/statistics", async (req, res) => {
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

router.get("/entries/statistics/new-students", async (req, res) => {
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

// Pinning Students Logic ---------------------------------------------------------

router.get("/pinned", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const caller_id = getUserId(req);
    const pinnedStudents = await knex("pinned_students")
      .select("pinned_user_id")
      .where("pinner_user_id", caller_id);
    res.json(pinnedStudents);
  } catch (error) {
    console.error("Error fetching pinned students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/pin/:id", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const caller_id = getUserId(req);
    const pinned_user_id = req.params.id;

    await knex("pinned_students").insert({
      pinned_user_id,
      pinner_user_id: caller_id,
    });
    res.status(200).json({ message: "Student pinned successfully" });
  } catch (error) {
    console.error("Error pinning student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/unpin/:id", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const caller_id = getUserId(req);
    const pinned_user_id = req.params.id;

    await knex("pinned_students")
      .delete()
      .where("pinned_user_id", pinned_user_id)
      .andWhere("pinner_user_id", caller_id);

    res.status(200).json({ message: "Student unpinned successfully" });
  } catch (error) {
    console.error("Error unpinning student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/paginated", async (req, res) => {
  try {
    const role = getRole(req);
    if (role !== 1 && role !== 2) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestedStudents = req.body.students;
    const showDate = new Date(req.body.showDate);
    const showYear = showDate.getFullYear(); // Extract the year from showDate

    const studentsWithJournalEntries = await Promise.all(
      requestedStudents.map(async (student) => {
        const journalEntries = await knex("journal_entries")
          .select("*")
          .where({
            user_id: student.user_id,
          })
          .andWhere(knex.raw("YEAR(date) = ?", [showYear])) // Filter by the same year
          .orderBy("date", "desc");

        return {
          ...student,
          journal_entries: journalEntries,
        };
      })
    );

    res.status(200).json(studentsWithJournalEntries);
  } catch (error) {
    console.error("Error fetching paginated students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
