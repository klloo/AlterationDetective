const connection = require('../database/connect');
const AlterationShopQuery = require('../queries/alterationShop.query');

const shopService = {
    /**
     * 수선집 목록을 조회한다.
     */
    getAlterationShopList: () => new Promise ((resolve, reject) => {
        connection.query(AlterationShopQuery.selectAlterationShopList, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    }),
};     

module.exports = shopService;