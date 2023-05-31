const reviewService = require('../services/review.service');
const Result = require('../models/result');

const reviewContorller = {
    /**
     * 수선집 리뷰 목록을 조회한다.
     */
    getAlterationShopReviewList: async (req, res) => {
        const result = new Result();
        const alterationShopId = req.body.alterationShopId;
        const data = await reviewService.getAlterationShopReviewList(alterationShopId);
        result.success = true;
        result.data = data;
        res.send(result);
    },
    /**
     * 로그인한 사용자 별 수선집 리뷰 목록을 조회한다.
     */
    getAlterationShopUserReviewList: async (req, res) => {
        const result = new Result();
        result.success = false;
        if(req.isAuthenticated() && req.user) {
            const userEmail = req.user.userEmail;
            const data = await reviewService.getAlterationShopUserReviewList(userEmail);
            result.success = true;
            result.data = data;
            res.send(result);
        }
        else
            res.send(result);
    },
    /**
     * 수선집 리뷰를 작성한다.
     */
    registerReview: async (req, res) => {
        const result = new Result();
        result.success = false;
        if(req.isAuthenticated() && req.user) {
            const userEmail = req.user.userEmail;
            const review = req.body.review;
            review.userEmail = userEmail;
            await reviewService.insertAlterationShopReview(review);
            result.success = true;
            res.status(200).send(result);
        }
        else
            res.send(result);
    },    
    /**
     * 수선집 리뷰를 삭제한다.
     */
    deleteReview: async (req, res) => {
        const result = new Result();
        const reviewId = req.body.reviewId;
        await reviewService.deleteAlterationShopReview(reviewId);
        result.success = true;
        res.status(200).send(result);
    },    
};

module.exports = reviewContorller;