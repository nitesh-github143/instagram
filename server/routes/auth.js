const express = require('express')
const mongoose = require("mongoose")

const router = express.Router()
const model = require('../models/user')
const User = model.User

router
    .get('/', (req, res) => {
        res.send('hello')
    })
    .post('/signup', (req, res) => {
        const { name, email, password } = req.body
        if (!email || !name || !password) {
            res.status(422).json({ error: "Please fill all the details" })
        }
        User.findOne({ email })
            .then(savedUser => {
                if (savedUser) {
                    res.status(422).json({ error: "User already exist" })
                }
                const user = new User({
                    name,
                    email,
                    password
                })
                user.save()
                    .then(user => {
                        res.send({ message: "User saved success" })
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