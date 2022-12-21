const express = require('express');
const router = express.Router()
const AlterationShopController = require('../controllers/alterationShop.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.get('/get-tag-list', wrapAsyncController(AlterationShopController.getTagList));
router.post('/get-alteration-shop-list', wrapAsyncController(AlterationShopController.getAlterationShopList));
router.post('/get-alteration-shop-detail', wrapAsyncController(AlterationShopController.getAlterationShopDetail));
router.post('/toggle-shop-like', wrapAsyncController(AlterationShopController.toggleShopLike));

module.exports = router