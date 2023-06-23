require("dotenv").config()
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const model = require('../models/post')
const { isLogin } = require("../middleware/isLogin")
const Post = model.Post

router
    .get('/allpost', isLogin, (req, res) => {
        Post.find()
            .populate("postedBy", "_id name")
            .then(posts => {
                res.json({ posts })
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post('/createpost', isLogin, (req, res) => {
        const { title, body } = req.body
        if (!title || !body) {
            return res.status(422).json({ error: "Please fill all the details" })
        }
        req.user.password = undefined
        const post = new Post({
            title,
            body,
            postedBy: req.user
        })
        post.save()
            .then(result => {
                res.json({ post: result })
            })
            .catch(err => {
                console.log(err)
            })
    })

exports.router = router