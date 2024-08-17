var express = require("express");
var router = express.Router();

const config = require("../utils/config");
const options = config.DATABASE_OPTIONS;
const knex = require("knex")(options);
const { getUserId } = require("../middleware/auth");
const { getRole } = require("../middleware/auth");

router.get("/courseSegments", async (req, res, next) => {
  console.log(" trying to get course segments");
  const user_id = req.params.id;
  try {
    const segments = await knex("course_segments").select("*");
    segments.sort((a, b) => a.order_number - b.order_number);

    res.json(segments);
  } catch (err) {
    console.error("Failed to fetch data", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.put("/courseSegments", async (req, res, next) => {
  const user_id = req.params.id;

  //   return user if not admin (role 1)
  if (getRole(req) !== 1) {
    return res.status(403).json({ error: "Unauthorized access" });
  } else
    try {
      const segment = await knex("course_segments")
        .where({ id: req.body.id })
        .update({
          value: req.body.value,
          name: req.body.name,
          order_number: req.body.order_number,
        });
      res.json(segment);
    } catch (err) {
      console.error("Failed to update data", err);
      res.status(500).json({ error: "Failed to update data" });
    }
});

module.exports = router;
