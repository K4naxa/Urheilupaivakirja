var express = require('express');
var router = express.Router();

const config = require('../utils/config')
const options = config.DATABASE_OPTIONS;
const knex = require('knex')(options);

router.get('/options', async (req, res, next) => {
    
    Promise.all([
        knex('student_groups').select('*'),
        knex('sports').select('*'),
        knex('campuses').select('*')
    ]).then(results => {
        const [student_groups, sports, campuses] = results;
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            student_groups,
            sports,
            campuses
        });
    }).catch(err => {
        console.log('Error fetching categories data', err);
        res.status(500).json({ error: "An error occurred while fetching categories data" });
    });
});


module.exports = router;
