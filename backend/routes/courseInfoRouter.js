var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getUserId } = require("../middleware/auth");

const { getRole } = require("../middleware/auth");

router.get("/complition_requirement/", async (req, res, next) => {
  console.log(" trying to get complition requirement");
  const user_id = req.params.id;
  try {
    const requirementCount = await knex("course_infos")
      .where({ name: "complition_requirement" })
      .select("value");
    res.json(requirementCount);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.put("/complition_requirement/", async (req, res, next) => {
  const user_id = req.params.id;

  //   return user if not admin (role 1)
  if (getRole(req) !== 1) {
    return res.status(403).json({ error: "Unauthorized access" });
  } else
    try {
      const requirementCount = await knex("course_infos")
        .where({ name: "complition_requirement" })
        .update({ value: req.body.value });
      res.json(requirementCount);
    } catch (err) {
      console.error("Failed to update data", err);
      res.status(500).json({ error: "Failed to update data" });
    }
});

module.exports = router;
