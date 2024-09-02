const express = require('express');
const app = express();
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
const router = express.Router();

// render the login root page
router.get("/:id", (req, res, next) => {
    var payload = {
        pageTitle: 'View post',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render("postPage", payload);
});


module.exports = router;