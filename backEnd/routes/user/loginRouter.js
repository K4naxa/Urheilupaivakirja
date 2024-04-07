var express = require('express');
var router = express.Router();

const config = require('../../utils/config')
const options = config.DATABASE_OPTIONS;
const knex = require('knex')(options);
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res, next) => {
    const user = req.body;
    console.log(user);

    try {
        const dbUsers = await knex('users').select('id', 'email', 'password', 'email_verified', 'role_id').where('email', '=', user.email);
        if (dbUsers.length === 0) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        
        const tempUser = dbUsers[0];
        const passwordCorrect = await bcrypt.compare(user.password, tempUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ error: "invalid email or password" });
        }

        console.log(tempUser);

        const userForToken = {
            email: tempUser.email,
            user_id: tempUser.id,
            role: tempUser.role_id
        };

        const token = jwt.sign(userForToken, config.SECRET);

        // Update last_login_at on successful login
        await knex('users').where('email', '=', tempUser.email).update({ last_login_at: new Date()});

        res.status(200).send({
            token,
            email: tempUser.email,
            role: tempUser.role_id
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
