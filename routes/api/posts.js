const express = require('express');
const app = express();
const router = express.Router();
const Post = require('../../schemas/postSchemas');
const User = require('../../schemas/UserSchema');

// render the login root page
router.get("/", (req, res, next) => {
    Post.find()
    // populate the user
    .sort({"createdAt": -1})
    .populate("postedBy")
    .then(results => res.status(200).send(results))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
});

// Post request router that defines the post endpoint
router.post("/", async (req, res, next) => {
    // No content is sent, set status to 400
    if (!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }
    // Create the postData using the postSchema from req.body and req.session
    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
    .then(async newPost => {
        // Populate the postedBy field with User object field
        newPost = await User.populate(newPost, { path: 'postedBy' })
        // 201 for created
        res.status(201).send(newPost);
    })
    // Error handling
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
});

module.exports = router;