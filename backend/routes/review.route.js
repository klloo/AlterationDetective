const express = require('express');
const router = express.Router()
const reviewController = require('../controllers/review.controller');
const wrapAsyncController = require('../controllers/wrapAsync.controller');

router.post('/get-alteration-shop-review-list', wrapAsyncController(reviewController.getAlterationShopReviewList));
router.get('/get-alteration-shop-user-review-list', wrapAsyncController(reviewController.getAlterationShopUserReviewList));
router.post('/register-review', wrapAsyncController(reviewController.registerReview));
router.post('/delete-review', wrapAsyncController(reviewController.deleteReview));

module.exports = router