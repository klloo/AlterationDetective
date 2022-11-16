const LocalStrategy = require('passport-local').Strategy;

exports.config = (passport) => {
    // 로그인 시 사용자 정보를 세션에 저장하기 위해 호출. id만 저장하도록 설정
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 매 요청 시 호출되면서 세션에 저장된 정보(id)를 불러옴
    // 그 id에 해당하는 user를 찾아서 done에 넣어주면 req.user에 유저정보가 저장됨
    passport.deserializeUser((id, done) => {
        const user = {
            id: 'asdf',
            name: 'aasdf',
            age: '23',
        };
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'password'
    }, (id, password, done) => {
        const user = {
            id: 'asdf',
            name: 'aasdf',
            age: '23',
        };
        done(null, user);
        // 비밀번호 틀렸을 때 
        // done(null, false, { message: "비밀번호 틀림"});
        // 아이디 없을 때 
        // done(null, false, { message: "가입되지 않은 회원"}); 
    }));
}