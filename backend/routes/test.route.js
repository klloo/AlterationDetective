var express = require('express')
var router = express.Router()
const TestController = require('../controllers/test.controller')

router.get('/server-data', TestController.getTestDataList);

module.exports = router