const express = require('express')
const app = express()
const PORT = 5000

// routes
const login = require('./routes/login')
const timetable = require('./routes/timetable')

// ejs support
app.set('view engine', 'ejs')

// middleware
app.use(express.json())

// routes
app.get('/hello', (req, res) => {
  res.send('Hello!')
})

app.use('/login', login)

// keep these two at the bottom
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}...`)
})
