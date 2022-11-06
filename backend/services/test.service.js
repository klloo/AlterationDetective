const connection = require('../database/connect');
const TestQuery = require('../queries/test.query');

const testService = {
    getTestDataList: (result) => {
        connection.query(TestQuery.getTestDataList, (error, data) => {
            if(error) {
                result(error, null);
            } else {
                result(null, data[0]);
            }
        });
    }
};     

module.exports = testService;