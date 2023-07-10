require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())

const DATABASE = process.env.DATABASE
const PORT = process.env.PORT || 5000

// connection with Database 
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(DATABASE);
    console.log('DB connected')
}


app.use(express.json())

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')

app.use('/', authRouter.router)
app.use('/', postRouter.router)
app.use('/', userRouter.router)

app.listen(PORT, () => {
    console.log('server created')
})