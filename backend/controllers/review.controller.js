const reviewService = require('../services/review.service');
const Result = require('../models/result');
const multer = require('multer');
const isNil = require('lodash/isNil');

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
        const review = await reviewService.getAlterationShopReview(reviewId);
        if (!isNil(review.file_name))
            await reviewService.deleteReviewImage(review.file_name);
        await reviewService.deleteAlterationShopReview(reviewId);
        result.success = true;
        res.status(200).send(result);
    },  
    /**
     * 리뷰 이미지를 업로드한다.
     */
    uploadImage: (req, res, next) => {
        res.status(204).send();
    },
    // 파일 저장 경로와 파일 이름 설정하여 multer 미들웨어 설정
    upload: multer({ storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/image');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }}),
    }),
};

module.exports = reviewContorller;