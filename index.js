var express = require('express');
const fetch = require('node-fetch');
var compression = require('compression');

const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
var path = require('path');
var app = express();


app.use(compression());
var handler = require('./routes/handler');
// const mime = require('mime');
var port = process.env.PORT;
//var port = 3000;
// var session=require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());var request = require('request');
var exphbs = require('express-handlebars');

var handlebars = require('express-handlebars');

app.use(express.static(path.join(__dirname,"assets")));
// app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));


app.engine('handlebars', exphbs({
  defaultLayout: 'credit_list',
  layoutsDir: path.join(__dirname, '/views')
}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.listen(port,()=>{
app.use('/',handler);
});


module.exports = app;
