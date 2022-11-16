const { application } = require('express');
const passport = require('passport');
const { request } = require('../app');
const UserService = require('../services/user.service');

const userContorller = {
    getTestDataList: async (req, res) => {
        data = await UserService.getTestDataList;
        res.send(data);
    },
    /**
     * 현재 로그인 중인 사용자 조회
     */
    getLoginUser: (req, res, next) => {
        if(req.isAuthenticated() && req.user) {
            return res.send({ user: req.user });
        }
        return res.send({ user: null });
    },
    /**
     * 로그인 한다
     */
    login: (req, res, next) => {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        passport.authenticate('local', (authError, user, info) => {
            if(authError) {
                return next(authError);
            }
            if(!user) {
                return res.send(info);
            }
            return req.login(user, (loginError) => {
                if(loginError) {
                    return next(loginError);
                }
                return res.send({ user });
            });
        })(req, res, next);
    },
    /**
     * 로그아웃 한다.
     */
     logout: (req, res) => {
        req.logout((err) => {
            req.session.destroy();
            if(err) res.redirect('/');
            res.status(200).send('complete logout');
        });
    },

};

module.exports = userContorller;