const { application } = require('express');
const passport = require('passport');
const { request } = require('../app');
const UserService = require('../services/user.service');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

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
    /**
     * 회원 가입 인증 메일을 전송한다.
     */
    sendAuthMail: async(req, res) => {
        // 인증코드 생성
        const authNum = Math.random().toString().substring(2,6);
        // 이메일 템플릿 설정
        let emailTemplate;
        const appDir = path.dirname(require.main.filename);
        ejs.renderFile(appDir + '/template/authMail.ejs', { authCode: authNum }, (err, email) => {
            emailTemplate = email;
            if(err) console.log(err);
        });
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: process.env.NODEMAILER_USER,
        //         pass: process.env.NODEMAILER_PASS,
        //     },
        // });
    
        // const email = 'asdf016182@naver.com';
        // const mailOptions = await transporter.sendMail({
        //     from: '수선탐정',
        //     to: email,
        //     subject: '회원가입을 위한 인증번호를 입력해주세요.',
        //     html: emailTemplate,
        // });

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //     }
        //     console.log("Finish sending email : " + info.response);
        //     res.send(authNum);
        //     transporter.close()
        // });
    }

};

module.exports = userContorller;