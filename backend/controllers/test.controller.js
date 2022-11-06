const TestService = require('../services/test.service');

const testContorller = {
    getTestDataList: (req, res) => {
        try {
            TestService.getTestDataList((err, data) => {
                if (err) {
                    res.send(err);
                }
                res.send(data);
            });
        } catch(e) {
            throw new Error(e);
        }
    }
}

module.exports = testContorller;