const dotenv = require('dotenv')
const app = require('./app')
const { connectDB } = require('./config/database.js')

dotenv.config({
  path: './.env',
})

const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5002

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

    server.on('error', (error) => {
      console.log('Server error:', error)
      throw error
    })
  } catch (error) {
    console.log('Startup failed!', error)
  }
}

startServer()
