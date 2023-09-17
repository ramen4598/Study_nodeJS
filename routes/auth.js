const express = require('express');
const router = express.Router();
const template = require("../lib/template.js");
const auth = require('../lib/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd'
  },
  (email, password, done)=>{
    if(email == null || email != authData){
      return done(null, false, {
        message: "삐삑! 잘못된 이메일입니다. 다시 시도하세요"
      });
    }
    if(password == null || password != authData.password){
      return done(null, false, {
        message: "비삑! 잘못된 이메일입니다 다시 시도하세요"
      });
    }
    return done(null, authData,{
      message: "삑! ${authData.nickname}님 환영합니다."
    });
  }
));

const authData = {
  email: 'email',
  password: 'password',
  nickname: 'tiredI'
}

router.get('/login', auth.statusUI, template.List, (req, res, next) => {
  req.title = "login";
  req.desc = `
      <form action="/auth/login" method="post">
        <p>
            <div>
                <label>
                    <b>Email</b></br>
                    <input type="text" name="email" placeholder="email" required>
                </label>
            </div>
            <div>
                <label>
                    <b>Password</b></br>
                    <input type="password" name="pwd" placeholder="password" required>
                </label>
            </div>
        </p>
        <input type="submit" value="login">
      </form>
    `;
  req.control = '';
  req.author = '';
  next();
}, template.HTML);

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
});

module.exports = router;
