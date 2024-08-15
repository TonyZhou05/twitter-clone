const express = require('express');
const app = express();
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const router = express.Router();

// use pug as template view engine
app.set('view engine', 'pug');
// Use views folder for views
app.set('views', 'views');

// render the login root page
router.get("/", (req, res, next) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/login')
        })

    }
});



module.exports = router;