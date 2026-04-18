const express = require('express')
const router = express.Router()

const { getMainDashboard } = require('../controllers/MainDashboard')

router.route('/').get(getMainDashboard)

module.exports = router
