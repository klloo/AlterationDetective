const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// 데이터베이스 connection 객체 생성
const connection = require('knex')({
    client: 'mysql',
    connection: {
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DB
    },
    // debug: true,
})

module.exports = connection;
 

 

