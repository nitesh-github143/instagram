require("dotenv").config()
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const model = require('../models/user')
const { isLogin } = require("../middleware/isLogin")
const User = model.User

router
    .get('/protect', isLogin, (req, res) => {
        res.send("hello Youtube")
    })
    .post('/signup', (req, res) => {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(422).json({ error: "Please fill all the details" })
        }
        User.findOne({ email })
            .then(savedUser => {
                if (savedUser) {
                    return res.status(422).json({ error: "User already exist" })
                }
                bcrypt.hash(password, 10)
                    .then(hashPassword => {
                        const user = new User({
                            name,
                            email,
                            password: hashPassword
                        })
                        user.save()
                            .then(user => {
                                res.json({ message: "User saved successfully" })
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post("/login", (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "Please fill all the details" })
        }
        User.findOne({ email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "User does not exist" })
                }
                bcrypt.compare(password, savedUser.password)
                    .then(isCorrect => {
                        if (isCorrect) {
                            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                            const { _id, name, email } = savedUser
                            res.json({ token, user: { _id, name, email } })
                        } else {
                            return res.status(422).json({ error: "Invalid details" })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })

exports.router = router