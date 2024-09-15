var express = require("express");
var router = express.Router();

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
        "sg.is_verified as group_verified",
        "c.name as campus",
        "sp.name as sport",
        "sp.is_verified as sport_verified",
        "u.email"
      )
      .leftJoin("users as u", "s.user_id", "u.id")
      .leftJoin("student_groups as sg", "s.group_id", "sg.id")
      .leftJoin("campuses as c", "s.campus_id", "c.id")
      .leftJoin("sports as sp", "s.sport_id", "sp.id")
      .where("s.verified", false) // only include unverified students
      .andWhere("u.email_verified", true) // only include students with verified email
      .groupBy(
        "s.user_id",
        "u.email",
        "s.first_name",
        "s.last_name",
        "sg.name",
        "sg.is_verified",
        "c.name",
        "sp.name",
        "sp.is_verified"
      );
  };

  // get students with unverified emails
  const getEmailNotVerifiedStudents = () => {
    return knex("students as s")
      .select(
        "s.first_name",
        "s.last_name",
        "s.user_id",
        "sg.name as group",
        "sg.is_verified as group_verified",
        "c.name as campus",
        "sp.name as sport",
        "sp.is_verified as sport_verified",
        "u.email"
      )
      .leftJoin("users as u", "s.user_id", "u.id")
      .leftJoin("student_groups as sg", "s.group_id", "sg.id")
      .leftJoin("campuses as c", "s.campus_id", "c.id")
      .leftJoin("sports as sp", "s.sport_id", "sp.id")
      .where("u.email_verified", false) // only include students with unverified email
      .groupBy(
        "s.user_id",
        "u.email",
        "s.first_name",
        "s.last_name",
        "sg.name",
        "sg.is_verified",
        "c.name",
        "sp.name",
        "sp.is_verified"
      );
  };

  // get unverified sports
  const getUnverifiedSports = () => {
    return knex("sports")
      .select("id", "name", "created_by")
      .where("is_verified", false);
  };

  // get unverified student_groups
  const getUnverifiedStudentGroups = () => {
    return knex("student_groups")
      .select("id", "name", "created_by")
      .where("is_verified", false);
  };

  try {
    const [
      students,
      emailNotVerifiedStudents,
      sports,
      student_groups,
    ] = await Promise.all([
      getUnverifiedStudents(),
      getEmailNotVerifiedStudents(),
      getUnverifiedSports(),
      getUnverifiedStudentGroups(),
    ]);

    res.status(200).json({
      students,
      email_not_verified_students: emailNotVerifiedStudents,
      sports,
      student_groups,
    });
  } catch (err) {
    console.error("Error fetching unverified data: ", err);
    res.status(500).json({
      error: "An error occurred while fetching unverified data",
      details: err.message,
    });
  }
});

module.exports = router;
