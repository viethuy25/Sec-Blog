const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: String,
    description: String,
    author: String,
    date: Date,
    image: String,
});

module.exports = mongoose.model('BlogPost', BlogPostSchema)