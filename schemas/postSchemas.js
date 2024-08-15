const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {type: String, trim: true},
    // auto assign the type as the objectID
    postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean
}, { timestamps:true });

var User = mongoose.model('Post', postSchema);

module.exports = User;