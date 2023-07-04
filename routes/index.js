const express = require('express');
const router = express.Router();
const template = require("../lib/template.js");

class Ready{
  constructor(title, des, control, author){
    this.title = title;
    this.description = des;
    this.control = control;
    this.author = author;
    this.html = '';
  }
  async makeHtml() {
    this.html = await template.HTML(this);
  }
  response(response){
    response.status(200).send(this.html);
  }
}

router.get('/', (req,res)=>{
  const title = "Welcome :)";
  const description = "Here is for to test node.js server :)";
  const control = `
    <input type="button" value="create" onclick="redirect(this, '')"/>
  `;
  const author = '';
  const undefinedCase = new Ready(title, description, control, author);
  undefinedCase.makeHtml()
  .then(()=>{undefinedCase.response(res)});
})

module.exports = router;