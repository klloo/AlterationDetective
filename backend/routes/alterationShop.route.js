const express = require('express');
const router = express.Router()
const AlterationShopController = require('../controllers/alterationShop.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.get('/get-alteration-shop-list', wrapAsyncController(AlterationShopController.getAlterationShopList));

module.exports = router