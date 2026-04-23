const express = require('express')
const app = express()
const PORT = 5000

// routes
const login = require('./routes/login')
const timetable = require('./routes/timetable')
const { getUpcomingEventsPage } = require('./controllers/upcomingEvents')

// ejs support
app.set('view engine', 'ejs')

// middleware
app.use(express.json())
app.use(express.static('public'))

// routes
app.use('/login', login)

app.use('/MainDashboard', timetable)

app.get('/', (req, res) => {
  res.render('HomeScreen.ejs')
})

app.get('/hello', (req, res) => {
  res.send('Hello!')
})

app.get('/UpcomingEvents', getUpcomingEventsPage)

// Backwards-compatible routes (until nav/buttons updated everywhere)
app.get('/Exams', (req, res) => {
  res.redirect('/UpcomingEvents')
})

app.get('/Deadlines', (req, res) => {
  res.redirect('/UpcomingEvents')
})

// keep these two at the bottom
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}...`)
})
