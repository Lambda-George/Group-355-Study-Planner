const express = require('express')
const router = express.Router()
const {
  loginUser,
  registerUser,
  logoutUser,
} = require('../controllers/user.controller.js')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

module.exports = router
