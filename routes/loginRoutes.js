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
    res.status(200).render("login");
});

// Post request router that defines the post endpoint
router.post("/", async (req, res, next) => {
    var payload = req.body;

    if (req.body.logUserName && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                {userName: req.body.logUsername}, 
                {email: req.body.logUserName},
            ]
        }).catch((err) => {
            console.log(err);
            payload.error_message = "Something went wrong";
            res.status(200).render("register", payload);
        });
    
        if (user != null) {
            console.log(user.password);
            console.log(req.body.password);
            var result = await bcrypt.compare(req.body.logPassword, user.password);
            if (result === true) {
                req.session.user = user;
                return res.redirect('/');
            }
        }

        payload.error_message = "Login credentials incorrect";
        return res.status(200).render('login', payload);
    }
    payload.error_message = "Make sure each field has value";
    return res.status(200).render('login', payload);

});

module.exports = router;