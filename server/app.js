require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const DATABASE = process.env.DATABASE
const PORT = process.env.PORT || 4000

// connection with Database 
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(DATABASE);
    console.log('DB connected')
}

const authRoutes = require('./routes/auth')

app.use('/', authRoutes.router)
app.listen(PORT, () => {
    console.log('server created')
})