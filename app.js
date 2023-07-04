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

app.get('*', function(request, response) {
    response.status(404).send("Not found");
});

app.listen(3000);
