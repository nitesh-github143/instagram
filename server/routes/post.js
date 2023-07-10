require("dotenv").config()
const express = require('express')

const router = express.Router()
const model = require('../models/post')
const { isLogin } = require("../middleware/isLogin")
const e = require("express")
const Post = model.Post

router
    .get('/allpost', isLogin, (req, res) => {
        Post.find()
            .populate("postedBy", "_id name pic")
            .populate("comments.postedBy", "_id name")
            .sort('-createdAt')
            .then((posts) => {
                res.json({ posts })
            }).catch(err => {
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
    .get('/getfollowerspost', isLogin, (req, res) => {
        Post.find({ postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id name pic")
            .populate("comments.postedBy", "_id name pic")
            .sort('-createdAt')
            .then(posts => {
                res.json({ posts })
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post('/createpost', isLogin, (req, res) => {
        const { title, body, pic } = req.body
        if (!title || !body || !pic) {
            return res.status(422).json({ error: "Plase add all the fields" })
        }
        req.user.password = undefined
        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user
        })
        post.save().then(result => {
            res.json({ post: result })
        })
            .catch(err => {
                console.log(err)
            })
    })
    .put('/like', isLogin, (req, res) => {
        Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.user._id } }, { new: true })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({ error: err });
            });

    })
    .put('/unlike', isLogin, (req, res) => {
        Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.user._id } }, { new: true })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({ error: err });
            });

    })
    .put('/comment', isLogin, (req, res) => {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        };

        Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({ error: err });
            });

    })
    .delete('/deletepost/:id', isLogin, (req, res) => {
        Post.findOne({ _id: req.params.id })
            .populate("postedBy", "_id")
            .then(post => {
                if (!post) {
                    return res.status(422).json({ error: "Post not found" });
                }
                if (post.postedBy._id.toString() !== req.user._id.toString()) {
                    return res.status(401).json({ error: "You are not authorized to delete this post" });
                }
                return post.deleteOne();
            })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "An error occurred while deleting the post" });
            });

    });




exports.router = router