const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = mongoose.Schema.Types

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6pBSU_b8j6bJgsAZmyFaXtzC5_FUnYMIB1yzwiA_82SwFwPdv&s"
    },
    followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "User"
        }
    ]
})

exports.User = mongoose.model("User", userSchema)