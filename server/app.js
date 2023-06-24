require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const DATABASE = process.env.DATABASE
const PORT = process.env.PORT || 4000

// connection with Database 
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(DATABASE);
    console.log('DB connected')
}

app.use(cors())
app.use(express.json())

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

app.use('/', authRouter.router)
app.use('/', postRouter.router)

app.listen(PORT, () => {
    console.log('server created')
})