const passport = require('passport');
const UserService = require('../services/user.service');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const isEmpty = require('lodash/isEmpty');
const bcrypt = require('bcrypt');
const Result = require('../models/result');
const e = require('express');

const userContorller = {
    /**
     * 회원가입 시 사용자 정보를 저장한다.
     */
    registerUser: async (req, res) => {
        const userInfo = req.body;
        await UserService.registerUser(userInfo);
        const result = new Result();
        result.success = true;
        res.status(200).send(result);
    },
    /**
     * 사용자 정보를 수정한다.
     */
    updateUser: async (req, res) => {
        const userInfo = req.body;
        let email;
        if(req.isAuthenticated())
            email = req.user.userEmail;
        else 
            email = req.body.userEmail;
        await UserService.updateUser(userInfo, email);
        const data = await UserService.getUserByEmail(email);
        delete data.password;
        const result = new Result();
        result.success = true;
        result.data = data;
        res.send(result);
    },
    /**
     * 중복되는 이메일인지 여부를 조회한다. (true: 중복, false: 중복X)
     */
    checkDuplicatedEmail: async (req, res) => {
        const email = req.body.email;
        const data = await UserService.checkDuplicatedEmail(email);
        const result = new Result();
        result.success = true;
        result.data = data;
        res.send(result);
    },
    /**
     * 현재 로그인 중인 사용자 조회
     */
    getLoginUser: (req, res, next) => {
        const result = new Result();
        if(req.isAuthenticated() && req.user) {
            result.success = true;
            result.data = req.user;
            return res.send({ user: req.user });
        }
        result.data = {};
        return res.send(result);
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
                const result = new Result();
                result.message = info;
                return res.send(result);
            }
            return req.login(user, (loginError) => {
                if(loginError) {
                    return next(loginError);
                }
                return res.send(user);
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
            const result = new Result();
            result.success = true;
            res.status(200).send(result);
        });
    },
    /**
     * 회원 가입 인증 메일을 전송한다.
     */
    sendAuthMail: async(req, res) => {
        // 인증코드 생성 (랜덤 6자리 수)
        const authCode = Math.random().toString().substring(2,8);
        // 이메일 템플릿 설정
        let emailTemplate;
        const appDir = path.dirname(require.main.filename);
        ejs.renderFile(appDir + '/template/authMail.ejs', { authCode : authCode }, (err, email) => {
            emailTemplate = email;
            if(err) console.log(err);
        });

        // nodemailer 객체 초기화
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });
        
        // 메일 옵션 설정
        const email = req.body.email;
        const mailOptions = {
            from: '수선탐정',
            to: email,
            subject: '회원가입을 위한 인증번호를 입력해주세요.',
            html: emailTemplate,
        };
        // 메일 전송
        const result = new Result();
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Finish sending email : " + info.response);
                result.success = true;
                result.data = authCode;
                res.send(result);
            }
            transporter.close()
        });
    },
    /**
     * 로그인한 사용자의 즐겨찾는 장소를 조회한다.
     */
    getBookmarkPlace: async(req, res, next) => {
        const result = new Result();
        if(req.isAuthenticated() && req.user) {
            const email = req.user.userEmail;
            result.success = true;
            result.data = await UserService.getBookmarkPlace(email);
        }
        return res.send(result);
    },
    /**
     * 즐겨찾는 장소의 최대 아이디 값을 구한다. (새 장소 추가 시 사용)
     */
    getBookmarkPlaceMaxId: async(req, res, next) => {
        const result = new Result();
        result.success = true;
        result.data = await UserService.getBookmarkPlaceMaxId();
        return res.send(result);
    },
    /**
     * 즐겨찾는 장소를 수정한다한다.
     */
    updateBookmarkPlace: async(req, res, next) => {
        const result = new Result();
        if(req.isAuthenticated() && req.user) {
            const email = req.user.userEmail;
            const addList = req.body.addList;
            await UserService.addBookmarkPlace(addList, email);
            const editList = req.body.editList;
            await UserService.editBookmarkPlace(editList);
            const delList = req.body.delList;
            await UserService.deleteBookmarkPlace(delList);
            result.success = true;
        }
        res.status(200).send(result);
    },
    /**
     * 로그인한 사용자의 비밀번호가 맞는지 확인한다.
     */
    checkPassword: async (req, res, next) => {
        const result = new Result();
        if (!req.isAuthenticated()) 
            return res.send(result);
        const email = req.user.userEmail;
        // email로 사용자 정보 가져오기
        const user = await UserService.getUserByEmail(email);
        // email이 없는 경우
        if(isEmpty(user)) {
            result.message ="가입되지 않은 회원입니다.";
            return res.send(result);
        }
        const encodedPassword = user.password;
        const same = await bcrypt.compare(req.body.password, encodedPassword);
        result.success = true;
        if(same) 
            result.data = true;
        else 
            result.data = false;
        return res.send(result);
    },
    /**
     * 로그인한 사용자 정보를 삭제한다.
     */
    deleteUser: async(req, res, next) => {
        const result = new Result();
        if(req.isAuthenticated() && req.user) {
            const email = req.user.userEmail;
            await UserService.deleteUser(email);
            req.logout((err) => {
                req.session.destroy();
                if(err) res.redirect('/');
                const result = new Result();
                result.success = true;
                res.status(200).send(result);
            });
        }
        else
            res.status(200).send(result);
    },
};

module.exports = userContorller;