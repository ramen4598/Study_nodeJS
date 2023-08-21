const express = require('express');
const router = express.Router();
const template = require("../lib/template.js");
const auth = require('../lib/auth')

router.get('/', (req,res,next)=>{
  req.title = "Welcome :)";
  req.desc = "Here is for to test node.js server :)";
  req.control = '';
  if(req.session.is_logined) req.control = `<input type="button" value="create" onclick="redirect(this,'')"/>`;
  req.author = '';
  next();
},[auth.statusUI,template.List,template.HTML]);

module.exports = router;