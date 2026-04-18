const express = require('express')
const router = express.Router()

const { getLoginPage } = require('../controllers/login')

router.route('/').get(getLoginPage)

module.exports = router
