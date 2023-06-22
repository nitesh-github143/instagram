require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env.JWT_SECRET
const User = mongoose.model.User

const isLogin = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" })
        }
        console.log(payload)
        const { _id } = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next()
            })
    })
}

exports.isLogin = isLogin