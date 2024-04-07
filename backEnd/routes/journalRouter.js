var express = require('express');
var router = express.Router();

const config = require('../utils/config')
const options = config.DATABASE_OPTIONS;
const knex = require('knex')(options);

// Get all journal entries
// TODO: IMPLEMENT PROPER AUTHENTICATION, NOW REQUIRES JUST A WORKING TOKEN
router.get('/', (req, res, next) => {
    knex('journal_entries').select('*')
        .then((rows) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('SELECT * FROM `journal_entries` failed')
            res.status(500).json(
                { error: err }
            )
        })
})

// Get a single journal entry by journal_entry.id
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    knex('journal_entries').select('*').where('id', '=', id).first()
        .then((row) => {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        })
        .catch((err) => {
            console.log('SELECT (with ID) FROM `journal_entries` failed', err);
            res.status(500).json({ error: "Internal server error" });
        });
});




module.exports = router;
