const connection = require('../database/connect');
const fs = require('fs');

const reviewService = {
    /**
     * 수선집 리뷰 목록을 조회한다.
     */
    getAlterationShopReviewList: (alterationShopId) => new Promise ((resolve, reject) => {
        connection('review as r')
        .select('review_id AS reviewId', 'alteration_shop_id AS alterationShopId', 'r.user_email AS userEmail', 'user.username', 'title', 'content', 'star_rate AS starRate', 'create_datetime AS createDatetime', 'r.image')
        .join('user', 'user.user_email', '=', 'r.user_email')
        .where('alteration_shop_id', alterationShopId)
        .orderBy('create_datetime')
        .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 로그인한 사용자 별 수선집 리뷰 목록을 조회한다.
     */
    getAlterationShopUserReviewList: (userEmail) => new Promise ((resolve, reject) => {
        connection('review as r')
        .select('review_id AS reviewId', 'r.alteration_shop_id AS alterationShopId', 'shop.alteration_shop_name as alterationShopName', 'shop.address', 'r.user_email AS userEmail', 'user.username', 'title', 'content', 'star_rate AS starRate', 'create_datetime AS createDatetime', 'r.image')
        .join('user', 'user.user_email', '=', 'r.user_email')
        .join('alteration_shop as shop', 'shop.alteration_shop_id', '=', 'r.alteration_shop_id')
        .where('user.user_email', userEmail)
        .orderBy('create_datetime')
        .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 리뷰를 작성한다.
     */
    insertAlterationShopReview: (review) => new Promise ((resolve, reject) => {
        const item = {
            alteration_shop_id: review.alterationShopId,
            user_email: review.userEmail,
            content: review.content,
            star_rate: review.starRate,
            create_datetime: new Date(),
            image: review.imageUrl,
            file_name: review.fileName,
        }
        connection('review')
        .insert(item)
        .then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 리뷰를 삭제한다.
     */
    deleteAlterationShopReview: (reviewId) => new Promise ((resolve, reject) => {
        connection('review')
        .where('review_id', reviewId)
        .delete()
        .then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 리뷰 정보를 가져온다.
     */
    getAlterationShopReview: (reviewId) => new Promise ((resolve, reject) => {
        connection('review')
        .select('*')
        .where('review_id', reviewId)
        .then((data) => {
            resolve(data[0]);
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 리뷰 사진 파일을 삭제한다.
     */
    deleteReviewImage: (fileName) => new Promise ((resolve, reject) => {
        console.log(fileName);
        const filePath = `public/image/${fileName}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    }),
};     

module.exports = reviewService;