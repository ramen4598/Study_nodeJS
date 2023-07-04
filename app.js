require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require("./routes/topic.js");
const indexRouter = require('./routes/index.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

app.use('/static', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use((err, req, res, next)=>{ 
	console.error(err.stack);
    res.status(500).send("Something is wrong!");
});

app.listen(3000);
