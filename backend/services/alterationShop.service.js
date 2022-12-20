const connection = require('../database/connect');
const AlterationShopQuery = require('../queries/alterationShop.query');
const { cloneDeep, isEmpty, isNil } = require('lodash');

const shopService = {
    /**
     * 수선집 태그 목록을 조회한다.
     */
    getTagList: () => new Promise ((resolve, reject) => {
        connection.query(AlterationShopQuery.selectTagList, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    }),
    /**
     * 수선집 목록을 조회한다.
     */
    getAlterationShopList: (userId) => new Promise ((resolve, reject) => {
        connection.query(AlterationShopQuery.selectAlterationShopList, userId, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    }),
    /**
     * 수선집 상세 정보를 조회한다.
     */
    getAlterationShopDetail: (alterationShopId) => new Promise ((resolve, reject) => {
        connection.query(AlterationShopQuery.selectAlterationShopDetailInfo, alterationShopId, (error, data) => {
            if (error) {
                reject(error);
            }
            const result = cloneDeep(data[0]);
            const tagList = [];
            data.forEach(item => {
                if(!isNil(item.tagId)) {
                    tagList.push({
                        tagId: item.tagId,
                        tagName: item.tagName,
                    });
                }
            });
            if(!isEmpty(tagList)) {
                result.tagList = tagList;
            }
            resolve(result);
        });
    }),
    /**
     * 수선집 좋아요를 추가/삭제 한다.
     */
    toggleShopLike: (alterationShopId, userId) => new Promise ((resolve, reject) => {
        const params = [alterationShopId, userId];
        connection.query(AlterationShopQuery.selectLikeCount, params, (error, data) => {
            if (error) {
                reject(error);
            }
            const count = data[0].count;
            // 좋아요가 존재하므로 delete
            if (count > 0) {
                connection.query(AlterationShopQuery.deleteLike, params, (error) => {
                    if (error) {
                      reject(error);
                    }
                    resolve(false);
              }); 
            } else if(count <= 0) {
                // 좋아요가 존재하지 않으므로 insert
                connection.query(AlterationShopQuery.insertLike, params, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(true);
                });
            }
        });
    }),
};     

module.exports = shopService;