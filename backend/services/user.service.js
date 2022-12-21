const connection = require('../database/connect');
const bcrypt = require('bcrypt');

const userService = {
    /**
     * 사용자 정보를 추가한다.
     */
    registerUser: (userInfo) => new Promise ((resolve, reject) => {
        const encryptedPassword = bcrypt.hashSync(userInfo.password, 10);
        const params = {
            user_email: userInfo.userEmail,
            username: userInfo.username,
            password: encryptedPassword
        };
        connection('user').insert(params)
        .then(() => {
            resolve();
        })
        .catch((e) => {
            reject(e);
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
        connection('user')
        .select('user_email AS userEmail', 'username', 'password', 'address', 'latitude', 'longitude')
        .where('user_email', email)
        .then((data) => {
            resolve(data[0]);
        })
        .catch((e) => {
            reject(e);
        });
    }),
    /**
     * 중복되는 이메일인지 여부를 조회한다. (true: 중복, false: 중복X)
     */
    checkDuplicatedEmail: (email) => new Promise ((resolve, reject) => {
        connection('user')
        .count('* as count')
        .where('user_email', email)
        .then((data) => {
            resolve(data[0].count > 0);
        })
        .catch((e) => {
            reject(e);
        });
    }),
};     

module.exports = userService;