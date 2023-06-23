require("dotenv").config()
const jwt = require("jsonwebtoken")
const { User } = require("../models/user")

const JWT_SECRET = process.env.JWT_SECRET

const isLogin = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(422).json({ error: "You must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(422).json({ error: "You must be logged in" })
        }
        const { _id } = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next()
            })
    })
}

exports.isLogin = isLogin