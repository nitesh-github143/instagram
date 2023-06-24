require("dotenv").config()
const express = require('express')

const router = express.Router()
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
    .get('/mypost', isLogin, (req, res) => {
        Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name")
            .then(mypost => {
                res.json({ mypost })
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