const AlterationShopService = require('../services/alterationShop.service');
const Result = require('../models/result');

const alterationShopContorller = {
    /**
     * 수선집 목록을 조회한다.
     */
    getAlterationShopList: async (req, res) => {
        const data = await AlterationShopService.getAlterationShopList();
        const result = new Result();
        result.success = true;
        result.data = data;
        res.send(result);
    },

};

module.exports = alterationShopContorller;