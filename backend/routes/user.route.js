const express = require('express');
const router = express.Router()
const UserController = require('../controllers/user.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.post('/register', wrapAsyncController(UserController.registerUser));
router.post('/update', wrapAsyncController(UserController.updateUser));
router.post('/check-duplicated-email', wrapAsyncController(UserController.checkDuplicatedEmail));
router.get('/check', UserController.getLoginUser);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/send-auth-mail', wrapAsyncController(UserController.sendAuthMail));

module.exports = router