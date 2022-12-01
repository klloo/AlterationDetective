const connection = require('../database/connect');
const UserQuery = require('../queries/user.query');
const bcrypt = require('bcrypt');

const userService = {
    /**
     * 사용자 정보를 추가한다.
     */
    registerUser: (userInfo) => new Promise ((resolve, reject) => {
        const encryptedPassword = bcrypt.hashSync(userInfo.password, 10);
        const params = [userInfo.userEmail, userInfo.username, encryptedPassword];
        connection.query(UserQuery.insertUser, params, (error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    }),
    /**
     * 사용자 정보를 수정한다.
     */
    updateUser: (userInfo) => new Promise ((resolve, reject) => {
        const encryptedPassword = bcrypt.hashSync(userInfo.password, 10);
        const params = [encryptedPassword, userInfo.userEmail];
        // 쿼리 추가
        resolve();
    }),
    /**
     * 이메일에 해당하는 사용자 정보를 조회한다.
     */
    getUserByEmail: (email) => new Promise ((resolve, reject) => {
        connection.query(UserQuery.selectUserByEmail, email, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data[0]);
        });
    }),
    /**
     * 중복되는 이메일인지 여부를 조회한다. (true: 중복, false: 중복X)
     */
    checkDuplicatedEmail: (email) => new Promise ((resolve, reject) => {
        connection.query(UserQuery.selectCountUserByEmail, email, (error, count) => {
            if (error) {
                reject(error);
            }
            resolve(count[0].count > 0);
        });
    }),
};     

module.exports = userService;