const express = require('express');
const router = express.Router();
const template = require("../lib/template.js");

const authData = {
    email: 'email',
    password: 'password',
    nickname: 'tiredI'
}

router.route('/login')
  .get(template.List,(req,res,next)=>{
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
    req.author  = '';
    next();
  },template.HTML)
  .post((req,res,next)=>{
    let post = req.body;
    let email = post.email;
    let password = post.pwd;
    if(email == authData.email && password == authData.password){
        res.send(`<script>window.alert("삑! 환영합니다.");window.location.href = '/';</script>`);
    }else{
        res.send(`<script>window.alert("삐빅! 틀렸습니다. 다시 시도하세요");window.location.href = '/auth/login';</script>`);
    }
  });

module.exports = router;