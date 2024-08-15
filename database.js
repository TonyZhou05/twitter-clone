const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect('mongodb+srv://admin:dbpassword@twitter-clone-cluster.td21h.mongodb.net/?retryWrites=true&w=majority&appName=twitter-clone-cluster')
        .then(() => {
            console.log("database connection successful!")
        }).catch((err) => {
            console.log("Some error" + err);
        });
    }
}

module.exports = new Database;

