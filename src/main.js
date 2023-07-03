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

app.use('/etc', etc);

app.listen(3000);
/*
const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.page(request, response);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(request,response);
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else {
    topic.etc(request, response);
  }
});
app.listen(3000);
*/