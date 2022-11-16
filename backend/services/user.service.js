const TestQuery = require('../queries/test.query');
const connection = require('../database/connect');

const userService = {
    getTestDataList: new Promise((resolve, reject) => {
        connection.query(TestQuery.getTestDataList, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data[0]);
        });
    }),
};     

module.exports = userService;