const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

const router = express.Router();

// use pug as template view engine
app.set('view engine', 'pug');
// Use views folder for views
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:false }));

// render the login root page
router.get("/", (req, res, next) => {
    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var userName = req.body.userName.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    // retains the user information if the registration fails for the user to reenter
    var payload = req.body;

    if (firstName && lastName && userName && email && password) {
        // almost like a select query in sql
        // find the user using userName or email
        // This runs asyncronously
        var user = await User.findOne({
            $or: [
                {userName: userName}, 
                {email: email},
            ]
        }).catch((err) => {
            console.log(err);
            payload.error_message = "Something went wrong";
            res.status(200).render("register", payload);
        });

        if (user == null) {
            // insert if no existing user is found with input
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data).then((user) => {
                // once the user gets created, add the user into the session and 
                // redirect to home page
                req.session.user = user;
                return res.redirect("/");
            })
        } else {
            // user found
            if (email == user.email) {
                payload.error_message = "Email already in use";
            } else {
                payload.error_message = "UserName already in use";
            }
            res.status(200).render("register", payload);
        }

    } else {
        payload.error_message = "Make sure each field has an actual value"
        res.status(200).render("register", payload);
    }
})

module.exports = router;