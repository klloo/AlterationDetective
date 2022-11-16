const { application } = require('express');
const passport = require('passport');
const { request } = require('../app');
const UserService = require('../services/user.service');

const userContorller = {
    getTestDataList: async (req, res) => {
        data = await UserService.getTestDataList;
        res.send(data);
    },
    getLoginUser: (req, res, next) => {
        if(req.isAuthenticated() && req.user) {
            return res.send({ user: req.user });
        }
        return res.send({ user: null });
    },
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
                console.log(loginError);
                if(loginError) {
                    return next(loginError);
                }
                return res.send({ user });
            });
        })(req, res, next);
    },
};

module.exports = userContorller;