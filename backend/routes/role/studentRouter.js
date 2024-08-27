const express = require("express");
const router = express.Router();

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const {
  isAuthenticated,
  isTeacherOrSpectator,
  isTeacher,
  isStudent,
} = require("../../utils/authMiddleware");

// Get all students and the names of their sport, group and campus
router.get("/", isAuthenticated, isTeacherOrSpectator, async (req, res) => {
  try {
    // Get all students
    const allStudents = await knex
      .select(
        "user_id",
        "first_name",
        "last_name",
        "sports.name as sport_name",
        "student_groups.name as name",
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

    res.json(allStudents);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get all archived students
router.get("/archived", isAuthenticated, isTeacher, async (req, res) => {
  try {
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

// Archive a student
router.put("/archive/:id", isAuthenticated, isTeacher, async (req, res) => {
  try {
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

// Get student and journal data as a student
router.get("/data", isAuthenticated, isStudent, async (req, res) => {
  const userId = req.user.user_id; // ensure 'const' for scope safety

  try {
    // Fetch student data and journal entries in parallel
    const [student, journalSummary, journals] = await Promise.all([
      knex("students")
        .select(
          "students.*",
          "sports.name as sport_name",
          "student_groups.name as group_name",
          "campuses.name as campus_name",
          "users.email",
          "users.created_at",
          "users.id as user_id"
        )
        .leftJoin("sports", "students.sport_id", "sports.id")
        .leftJoin("student_groups", "students.group_id", "student_groups.id")
        .leftJoin("campuses", "students.campus_id", "campuses.id")
        .leftJoin("users", "students.user_id", "users.id")
        .where("students.user_id", userId)
        .first(),

      knex("journal_entries")
        .select(
          knex.raw("COUNT(DISTINCT DATE(date)) as unique_days_count"),
          knex.raw(
            "COUNT(CASE WHEN entry_type_id = 1 THEN 1 END) as entry_type_1_count"
          ),
          knex.raw("COUNT(*) as total_entries_count"),
          knex.raw("CAST(SUM(length_in_minutes) AS UNSIGNED) as total_minutes")
        )
        .where("user_id", userId)
        .first(),

      knex("journal_entries")
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
        .where("journal_entries.user_id", userId)
        .orderBy("journal_entries.date", "desc"),
    ]);

    // If no student is found, return 404
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Combine student and journal data into a single response object
    const studentData = {
      ...student,
      journal_entries: journals,
      ...journalSummary, // Spread the summary data directly into studentData
    };

    res.json(studentData);
  } catch (error) {
    console.error("Error fetching student data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get student data as teacher or spectator with userID
router.get(
  "/data/:userId",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      // Fetch student data and journal entries in parallel
      const studentPromise = knex("students")
        .select(
          "students.*",
          "sports.name as sport_name",
          "student_groups.name as group_name",
          "campuses.name as campus_name",
          "users.email",
          "users.created_at",
          "users.id as user_id"
        )
        .where("students.user_id", userId)
        .first()
        .leftJoin("sports", "students.sport_id", "sports.id")
        .leftJoin("student_groups", "students.group_id", "student_groups.id")
        .leftJoin("campuses", "students.campus_id", "campuses.id")
        .leftJoin("users", "students.user_id", "users.id");

      const journalDataPromise = knex("journal_entries")
        .where("journal_entries.user_id", userId)
        .select(
          knex.raw(
            "COUNT(DISTINCT DATE(journal_entries.date)) as unique_days_count"
          ),
          knex.raw(
            "COUNT(CASE WHEN journal_entries.entry_type_id = 1 THEN 1 END) as entry_type_1_count"
          ),
          knex.raw("COUNT(*) as total_entries_count"),
          knex.raw(
            "CAST(SUM(journal_entries.length_in_minutes) AS UNSIGNED) as total_minutes"
          )
        )
        .first();

      const journalsPromise = knex("journal_entries")
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

      const [student, journalData, journals] = await Promise.all([
        studentPromise,
        journalDataPromise,
        journalsPromise,
      ]);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Combine student and journal data
      const studentData = {
        ...student,
        journal_entries: journals,
        unique_days_count: journalData.unique_days_count,
        entry_type_1_count: journalData.entry_type_1_count,
        total_entries_count: journalData.total_entries_count,
        total_minutes: journalData.total_minutes,
      };

      res.json(studentData);
    } catch (error) {
      console.error("Error fetching student data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Pinning Students Logic ---------------------------------------------------------

// get pinned students
router.get(
  "/pinned",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
      const pinner_id = req.user.user_id;
      const pinnedStudents = await knex("pinned_students")
        .select("pinned_user_id")
        .where("pinner_user_id", pinner_id);

      res.json({ pinnedStudents });
    } catch (error) {
      console.error("Error fetching pinned students:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

// pin a student
router.post(
  "/pin/:id",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
      const pinner_id = req.user.user_id;
      const pinned_user_id = req.params.id;

      // Check if already pinned
      const existingPin = await knex("pinned_students")
        .where({
          pinner_user_id: pinner_id,
          pinned_user_id: pinned_user_id,
        })
        .first();

      if (existingPin) {
        return res.status(409).json({ message: "Student already pinned" });
      }

      await knex("pinned_students").insert({
        pinned_user_id,
        pinner_user_id: pinner_id,
      });
      res.status(201).json({ message: "Student pinned successfully" });
    } catch (error) {
      console.error("Error pinning student:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

// unpin a student
router.delete(
  "/unpin/:id",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
      const pinner_id = req.user.user_id;
      const pinned_user_id = req.params.id;

      const deleted = await knex("pinned_students")
        .where({
          pinned_user_id: pinned_user_id,
          pinner_user_id: pinner_id,
        })
        .delete();

      if (deleted === 0) {
        return res
          .status(404)
          .json({ message: "Student not found or already unpinned" });
      }

      res.status(200).json({ message: "Student unpinned successfully" });
    } catch (error) {
      console.error("Error unpinning student:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
);

/* NEW PAGINATED

router.post("/paginated", async (req, res) => {
    try {
        const requestedStudents = req.body.students;
        const showDate = new Date(req.body.showDate);
        const showYear = showDate.getFullYear();

        // Collect all user_ids to reduce the number of queries
        const studentIds = requestedStudents.map(student => student.user_id);
        const journalEntries = await knex("journal_entries")
            .select("*") // Consider limiting selected fields
            .whereIn('user_id', studentIds)
            .andWhere(knex.raw("YEAR(date) = ?", [showYear]))
            .orderBy("date", "desc");

        // Organize journal entries by user_id
        const entriesByUser = journalEntries.reduce((acc, entry) => {
            acc[entry.user_id] = acc[entry.user_id] || [];
            acc[entry.user_id].push(entry);
            return acc;
        }, {});

        // Map requested students to their journal entries
        const studentsWithJournalEntries = requestedStudents.map(student => ({
            ...student,
            journal_entries: entriesByUser[student.user_id] || []
        }));

        res.status(200).json(studentsWithJournalEntries);
    } catch (error) {
        console.error("Error fetching paginated students:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

*/
router.post(
  "/paginated",
  isAuthenticated,
  isTeacherOrSpectator,
  async (req, res) => {
    try {
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
  }
);

// verify student
router.put("/verify/:id", isAuthenticated, isTeacher, async (req, res) => {
  const user_id_to_verify = req.params.id;

  const updatedVerification = {
    verified: 1,
  };

  try {
    // check if the student  exists and is not already verified
    const existingStudent = await knex("students")
      .where({ user_id: user_id_to_verify, verified: 0 })
      .first();

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found or already verified" });
    }
    // update
    const updateCount = await knex("students")
      .where("user_id", "=", user_id_to_verify)
      .update(updatedVerification);

    if (updateCount > 0) {
      res.status(200).json({ message: "User verified successfully" });
    } else {
      // Just to make sure...
      res.status(400).json({ message: "No changes made, student was likely already verified" });
    }
  } catch (error) {
    console.error("Error verifying student:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


module.exports = router;
