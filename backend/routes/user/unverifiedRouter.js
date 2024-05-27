var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const { getRole } = require("../../middleware/auth");

const config = require("../../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  return authorization && authorization.toLowerCase().startsWith("bearer ")
    ? authorization.substring(7)
    : null;
};

router.get("/", async (req, res) => {
  const role = getRole(req);

  if (role !== 1) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const getUnverifiedStudents = () => {
    return knex("students as s")
      .select(
        "s.first_name",
        "s.last_name",
        "s.user_id",
        "sg.group_identifier as group",
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

  // Future expansions
  const getUnverifiedSports = () => {
    return knex("sports")
      .select("sports.id", "sports.name")
      .where("verified", false);
  };

  const getUnverifiedCampuses = () => {
    return knex("campuses")
      .select("campuses.id", "campuses.name")
      .where("verified", false);
  };

  try {
    const [
      students,
      // sports,
      // campuses,
    ] = await Promise.all([
      getUnverifiedStudents(),
      // getUnverifiedSports(),
      // getUnverifiedCampuses(),
    ]);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      students,
      // sports,
      // campuses,
    });
  } catch (err) {
    console.error("Error fetching unverified data", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching unverified data" });
  }
});

module.exports = router;
