const express = require('express');
const router = express.Router();
const template = require("../lib/template.js");

router.get('/', (req,res,next)=>{
  req.title = "Welcome :)";
  req.desc = "Here is for to test node.js server :)";
  req.control = `
    <input type="button" value="create" onclick="redirect(this,'')"/>
  `;
  req.author = '';
  next();
},[template.List,template.HTML]);

module.exports = router;