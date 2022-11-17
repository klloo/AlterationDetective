const express = require('express');
const router = express.Router()
const UserController = require('../controllers/user.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.get('/check', UserController.getLoginUser);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/send-auth-mail', wrapAsyncController(UserController.sendAuthMail));

module.exports = router