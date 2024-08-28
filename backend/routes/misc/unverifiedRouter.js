var express = require("express");
var router = express.Router();

const { getRole } = require("../../utils/authMiddleware");

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { isAuthenticated, isTeacher } = require("../../utils/authMiddleware"); 


router.get("/", isAuthenticated, isTeacher, async (req, res) => {

  // get unverified students
  const getUnverifiedStudents = () => {
    return knex("students as s")
      .select(
        "s.first_name",
        "s.last_name",
        "s.user_id",
        "sg.name as group",
        "c.name as campus",
        "sp.name as sport",
        "u.email"
      )
      .where("s.verified", false)
      .leftJoin("users as u", "s.user_id", "u.id")
      .leftJoin("student_groups as sg", "s.group_id", "sg.id")
      .leftJoin("campuses as c", "s.campus_id", "c.id")
      .leftJoin("sports as sp", "s.sport_id", "sp.id")
      .groupBy(
        "s.user_id",
        "u.email",
        "s.first_name",
        "s.last_name",
        "s.group_id",
        "s.campus_id",
        "s.sport_id"
      );
  };

  // get unverified sports
  const getUnverifiedSports = () => {
    return knex("sports")
      .select("id", "name")
      .where("is_verified", false);
  };

  // get unverified student_groups
  const getUnverifiedStudentGroups = () => {
    return knex("student_groups")
      .select("id", "name")
      .where("is_verified", false);
  };

  try {
    const [
      students,
      sports,
      student_groups,
    ] = await Promise.all([
      getUnverifiedStudents(),
      getUnverifiedSports(),
      getUnverifiedStudentGroups(),
    ]);

    res.status(200).json({
      students,
      sports,
      student_groups,
    });
  } catch (err) {
    console.error("Error fetching unverified data: ", err);
    res.status(500).json({
      error: "An error occurred while fetching unverified data",
      details: err.message
    });
  }
});


module.exports = router;