const express = require('express')
const app = express()
const login = require('./routes/login/login')
const PORT = 5000

// middleware
app.use(express.json())

// routes
app.get('/hello', (req, res) => {
  res.send('Hello!')
})

//app.use('/login', login)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}...`)
})
