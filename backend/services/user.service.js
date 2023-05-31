const isEmpty = require('lodash/isEmpty');
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
    updateUser: (userInfo, userEmail) => new Promise ((resolve, reject) => {
        const encryptedPassword = bcrypt.hashSync(userInfo.password, 10);
        const item = {
            username: userInfo.username,
            password: encryptedPassword
        };
        connection('user')
        .where('user_email', userEmail)
        .update(item)
        .then(() => {
            resolve();
        })
        .catch((e) => {
            reject(e);
        });
    }),
    /**
     * 이메일에 해당하는 사용자 정보를 조회한다.
     */
    getUserByEmail: (email) => new Promise ((resolve, reject) => {
        connection('user')
        .select('user_email AS userEmail', 'username', 'password')
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
    /**
     * 사용자의 즐겨찾는 장소를 조회한다.
     */
    getBookmarkPlace: (email) => new Promise ((resolve, reject) => {
        connection('bookmark_place as place')
        .select('place_id as placeId', 'place_name as placeName', 'place.address', 'icon_class as iconClass')
        .join('user', 'user.user_email', '=', 'place.user_email')
        .where('user.user_email', email)
        .then((data) => {
            resolve(data);
        })
        .catch((e) => {
            reject(e);
        });
    }),
    /**
     * 즐겨찾는 장소의 최대 아이디 값을 구한다. (새 장소 추가 시 사용)
     */
    getBookmarkPlaceMaxId: () => new Promise ((resolve, reject) => {
        connection('bookmark_place as place')
        .max('place_id as maxId')
        .then((data) => {
            resolve(data[0]);
        })
        .catch((e) => {
            reject(e);
        });
    }),

    /**
     * 즐겨찾는 장소를 삭제한다.
     */
    deleteBookmarkPlace: (delList) => new Promise ((resolve, reject) => {
        if(isEmpty(delList)) resolve();
        const delIds = delList.map((item) => item.placeId);
        connection('bookmark_place')
        .whereIn('place_id', delIds)
        .del()
        .then(() => {
            resolve();
        })
        .catch((e) => {
            reject(e);
        });
    }),
    /**
     * 즐겨찾는 장소를 추가한다.
     */
    addBookmarkPlace: (addList, email) => new Promise ((resolve, reject) => {
        if(isEmpty(addList)) resolve();
        const insertList = addList.map((item) => ({
            place_id: item.placeId,
            place_name: item.placeName,
            icon_class: item.iconClass,
            address: item.address,
            user_email: email,
        }));
        connection('bookmark_place').insert(insertList)
        .then(() => {
            resolve();
        })
        .catch((e) => {
            reject(e);
        });
    }),
    /**
     * 즐겨찾는 장소를 수정한다.
     */
    editBookmarkPlace: (editList) => new Promise ((resolve, reject) => {
        if(isEmpty(editList)) resolve();
        const updateList = editList.map((item) => ({
            place_id: item.placeId,
            place_name: item.placeName,
            icon_class: item.iconClass,
            address: item.address,
        }));
        connection.transaction(trx => {
            const queries = [];
            updateList.forEach(item => {
                const query = connection('bookmark_place')
                .where('place_id', item.place_id)
                .update(item)
                .transacting(trx);
                queries.push(query);
            });
            Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(() => {
            resolve();
        })
        .catch((e) => {
            reject(e);
        });
    })
};     

module.exports = userService;