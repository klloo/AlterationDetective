const LocalStrategy = require('passport-local').Strategy;
const userService = require('../services/user.service');
const isEmpty = require('lodash/isEmpty');
const bcrypt = require('bcrypt');
const Result = require('../models/result');

exports.config = (passport) => {
    // 로그인 시 사용자 정보를 세션에 저장하기 위해 호출. id만 저장하도록 설정
    passport.serializeUser((user, done) => {
        done(null, user.data.userEmail);
    });

    // 매 요청 시 호출되면서 세션에 저장된 정보(id)를 불러옴
    // 그 id에 해당하는 user를 찾아서 done에 넣어주면 req.user에 유저정보가 저장됨
    passport.deserializeUser((email, done) => {
        // id로 사용자 정보 가져오기
        userService.getUserByEmail(email).then((user) => {
            delete user.password;
            done(null, user);
        }).catch((err) => { done(err) });
    });

    passport.use(new LocalStrategy({
        usernameField: 'userEmail',
        passwordField: 'password'
    }, (email, password, done) => {
         // email로 사용자 정보 가져오기
         userService.getUserByEmail(email).then((user) => {
            // email이 없는 경우
            if(isEmpty(user)) {
                const result = new Result();
                result.success = false;
                result.message =  "가입되지 않은 회원입니다."
                done(null, false, result); 
                return;
            }
            const encodedPassword = user.password;
            bcrypt.compare(password, encodedPassword).then((same)=>{
                // 비밀번호가 일치하는 경우
                if(same) {
                    delete user.password;
                    const result = new Result();
                    result.success = true;
                    result.data = user;
                    done(null, result);
                } else {
                    // 비밀번호가 일치하지 않는 경우
                const result = new Result();
                result.success = false;
                result.message =  "비밀번호가 틀렸습니다."
                done(null, false, result); 
                }
            });
        }).catch((err) => { done(err) });
    }));
}