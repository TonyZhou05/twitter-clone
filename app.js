const express = require('express');
const app = express();
const port = 3003;
const path = require('path');
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

app.use(session({
    secret: "twitter session",
    resave: true,
    saveUninitialized: false
}));

const server = app.listen(port, () => {
    console.log("Server listening on port " + port);
})

app.set('view engine', 'pug');
// Use views folder for views
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:false }));
// public folder serves as static file
app.use(express.static(path.join(__dirname, "public")));
 
// routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');

//API route declaration
const postsApiRoute = require('./routes/api/posts');


// register routes here to use them from roots
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute)

//API routes
app.use('/api/posts', postsApiRoute);
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user,
    }
    res.status(200).render("home", payload)
})