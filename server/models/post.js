const mongoose = require("mongoose")
const { Schema } = mongoose
const { ObjectId } = mongoose.Schema.Types

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "no photo"
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    }
})

exports.Post = mongoose.model("Post", postSchema)