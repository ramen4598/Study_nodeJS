require('dotenv').config();
var express = require('express')
var app = express()
const topic = require("./lib/topic.js");
const etc = require("./lib/etc.js");
module.exports.mainPath = __dirname;

app.get('/', (req, res) => {
  topic.home(req, res);
});
app.get('/page/:pageId', (req, res) => {
  topic.page(req, res);
});

app.get('/create', (req,res)=>{
  topic.create(req, res);
})
app.post('/create_process', (req, res)=>{
  topic.create_process(req, res);
})

app.get('/update/:pageId', (req, res)=>{
  topic.update(req,res);
})
app.post('/update_process',(req,res)=>{
  topic.update_process(req, res);
})

app.post('/delete_process', (req,res)=>{
  topic.delete_process(req, res);
})

app.use('/etc', etc);

app.listen(3000);
