const express = require('express');
const app = express();
const router = express.Router();
const Post = require('../../schemas/postSchemas');
const User = require('../../schemas/UserSchema');

// render the login root page
router.get("/", (req, res, next) => {
    Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({ "createdAt": -1 })
    .then(async results => {
        results = await User.populate(results, { path: "retweetData.postedBy"});
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

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

router.put("/:id/like", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet"
    // Insert user liked and retrieve the updated user from the db
    req.session.user = await User.findByIdAndUpdate(userId, { [option] : { likes: postId } }, { new: true })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    var post = await Post.findByIdAndUpdate(postId, { [option] : { likes: userId } }, { new: true })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    return res.status(200).send(post);
})

router.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    // Try and delete retweet
    var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    var option = deletedPost != null ? "$pull" : "$addToSet"

    var repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    }

    // Insert user retweeted and retrieve the updated user from the db
    req.session.user = await User.findByIdAndUpdate(userId, { [option] : { retweets: repost._id } }, { new: true })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    var post = await Post.findByIdAndUpdate(postId, { [option] : { retweetUsers: userId } }, { new: true })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    return res.status(200).send(post);
})

module.exports = router;