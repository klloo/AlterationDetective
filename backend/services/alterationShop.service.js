const connection = require('../database/connect');
const AlterationShopQuery = require('../queries/alterationShop.query');
const { cloneDeep, isEmpty, isNil } = require('lodash');

const shopService = {
    /**
     * 수선집 목록을 조회한다.
     */
    getAlterationShopList: (params) => new Promise ((resolve, reject) => {
        const queryParams = [params.mapLongitude, params.mapLatitude, params.curLongitude, params.curLatitude, params.userId];
        const subQuery = connection.raw(`(${AlterationShopQuery.selectAlterationShopList}) shop`, queryParams);
        const basicQuery = connection(subQuery).select('*');
        if(!isNil(params.distance)) {
            basicQuery.where('mapDist', '<' , params.distance);
        }
        if(!isNil(params.keyword)) {
            const keyword = "%" + params.keyword + "%";
            basicQuery.where('alterationShopName', 'like', keyword);
        }
        basicQuery
        .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 상세 정보를 조회한다.
     */
    getAlterationShopDetail: (params) => new Promise ((resolve, reject) => {
        const queryParams = [params.longitude, params.latitude, params.userId, params.alterationShopId];
        connection.raw(AlterationShopQuery.selectAlterationShopDetailInfo, queryParams)
        .then((data) => {
            const result = cloneDeep(data[0][0]);
            resolve(result);
        })
        .catch((err) => {
            reject(err);
        });
    }),
    /**
     * 수선집 좋아요를 추가/삭제 한다.
     */
    toggleShopLike: (alterationShopId, userId) => new Promise ((resolve, reject) => {
        const params = { 
            alteration_shop_id: alterationShopId,
            user_id: userId,
        };
        connection('shop_like')
        .count('* as count')
        .where('user_id', userId)
        .andWhere('alteration_shop_id', alterationShopId)
        .then((data) => {
            const count = data[0].count;
            // 좋아요가 존재하므로 delete
            if (count > 0) {
                connection('shop_like')
                .where('user_id', userId)
                .andWhere('alteration_shop_id', alterationShopId)
                .delete()
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
            } else if(count <= 0) {
                // 좋아요가 존재하지 않으므로 insert
                connection('shop_like')
                .insert(params)
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    }),
    /**
     * 좋아요한 수선집 목록을 조회한다.
     */
    getLikeShopList: (params) => new Promise ((resolve, reject) => {
        const queryParams = [params.mapLongitude, params.mapLatitude, params.curLongitude, params.curLatitude, params.userId];
        const subQuery = connection.raw(`(${AlterationShopQuery.selectAlterationShopList}) shop`, queryParams);
        const basicQuery = connection(subQuery).select('*');
        basicQuery.where('likeFlag', true);
        basicQuery
        .then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }),
};     

module.exports = shopService;