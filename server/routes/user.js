require("dotenv").config()
const express = require('express')

const router = express.Router()
const userModel = require('../models/user')
const postModel = require('../models/post')
const { isLogin } = require("../middleware/isLogin")
const User = userModel.User
const Post = postModel.Post

router
    .get("/user/:id", isLogin, (req, res) => {
        User.findOne({ _id: req.params.id })
            .select("-password")
            .then(user => {
                Post.find({ postedBy: req.params.id })
                    .populate("postedBy", "_id name")
                    .exec()
                    .then(posts => {
                        res.json({ user, posts });
                    })
                    .catch(err => {
                        return res.status(422).json({ error: err });
                    });
            })
            .catch(err => {
                return res.status(404).json({ error: "User not found" });
            });

    })
    .put("/follow", isLogin, (req, res) => {
        User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        })
            .then(result => {
                User.findByIdAndUpdate(req.user._id, {
                    $push: { following: req.body.followId }
                }, {
                    new: true
                })
                    .select("-password")
                    .then(updatedUser => {
                        res.json(updatedUser);
                    })
                    .catch(err => {
                        return res.status(422).json({ error: err });
                    });
            })
            .catch(err => {
                return res.status(422).json({ error: err });
            });

    })
    .put("/unfollow", isLogin, (req, res) => {
        User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        })
            .then(() => {
                return User.findByIdAndUpdate(req.user._id, {
                    $pull: { following: req.body.unfollowId }
                }, {
                    new: true
                }).select("-password");
            })
            .then(updatedUser => {
                res.json(updatedUser);
            })
            .catch(err => {
                return res.status(422).json({ error: err });
            });

    })
    .put("/updatepic", isLogin, (req, res) => {
        User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                res.status(422).json({ error: "pic cannot post" });
            });
    })




exports.router = router