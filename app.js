require('dotenv').config();
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const checkCookie = require('./lib/checkCookie.js');
const topicRouter = require("./routes/topic.js");
const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');

// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.get('*', checkCookie.checkDarkMode);

const options = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};
const sessionStore = new MySQLStore(options);
app.use(session({
  //key: 'session_cookie_name',
  secret: process.env.SESSION_COOKIE_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
sessionStore.onReady().then(() => {
  console.log('MySQLStore ready');
}).catch(error => {
  console.error(error);
});

app.use('/static', express.static(__dirname + '/public'));
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something is wrong!");
});

app.listen(3000);
