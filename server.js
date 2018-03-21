var express = require('express');
var app = express();
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars')
var env = require('dotenv').load();
//Models
var models = require("./app/models");
var authRoute = require('./app/routes/auth.js')(app,passport);
//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

app.get('/', function(req, res) {
 
    res.send('Welcome to Passport with Sequelize');
 
});
 
 
app.listen(5000, function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions


 
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');