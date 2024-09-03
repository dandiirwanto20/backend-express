const express = require('express')

// import cors
const cors = require('cors')
const bodyParser = require('body-parser')

// init app
const app = express()

const router = require('./routes')

// use cors
app.use(cors())

// use body parser
app.use(bodyParser.urlencoded({
    extended: false
}))

// use body parser
app.use(bodyParser.json())

const port = 3000;

// route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// define routes
app.use('/api', router)

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`); // implement string template atau string literal
})