const express = require('express');
const router = express.Router()
const UserController = require('../controllers/user.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.get('/login', UserController.getLoginUser);
router.post('/login', UserController.login);

module.exports = router