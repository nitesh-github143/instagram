require('dotenv').config()
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const router = express.Router()
const model = require('../models/user')
const { isLogin } = require('../middleware/isLogin')
const JWT_SECRET = process.env.JWT_SECRET
const User = model.User

router
    .get('/fetch', isLogin, (req, res) => {
        res.send('hello')
    })
    .post('/signup', (req, res) => {
        const { name, email, password } = req.body
        if (!email || !name || !password) {
            return res.status(422).json({ error: "Please fill all the details" })
        }
        User.findOne({ email })
            .then(savedUser => {
                if (savedUser) {
                    return res.status(422).json({ error: "User already exist" })
                }
                bcrypt.hash(password, 10)
                    .then(hashedPassword => {
                        const user = new User({
                            name,
                            email,
                            password: hashedPassword
                        })
                        user.save()
                            .then(user => {
                                res.send({ message: "User saved success" })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    })
    .post('/login', (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "Please add all the details" })
        }
        User.findOne({ email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Invalid detail" })
                }
                bcrypt.compare(password, savedUser.password)
                    .then(isCorrect => {
                        if (isCorrect) {
                            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                            res.json({ token })
                        } else {
                            return res.status(422).json({ error: "Invalid detail" })
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