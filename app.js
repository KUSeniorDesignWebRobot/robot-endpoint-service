const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const messenger = require('./controllers/CurveRD');
const mq = require('./controllers/MessageQueue');
const hl = require('./controllers/HandshakeListener');
const state = require("./controllers/StateManager");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require('connect-flash');
const session = require('express-session');
const models = require('./models');
const User = models.User;
const UserController = require('./controllers/User');

/*
 * Add new routes files here
 */

const routes = require("./routes/index");
const robotRoutes = require("./routes/robot");
const sessionRoutes = require("./routes/session");
const appRoutes = require("./routes/app");

const app = express();

const env = process.env.NODE_ENV || "development";
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == "development";

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(flash());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(favicon(__dirname + '/public/img/favicon.ico'));

/*
 * Passport configuration
 */
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    }).then(
      user => {
        console.log('authenticating');
        if (!user || !UserController.validPassword(user, password)) {
          console.log('authentication failed');
          return done(null, false, {
            error: "Invalid credentials"
          });
        }
        console.log('authentication success');
        return done(null, user);
      },
      error => {
        return done(error);
      }
    );
  })
);

passport.serializeUser(function(user, cb) {
  console.log('serialize');
  cb(null, user.id);
});

passport.deserializeUser(function(userid, cb) {
  console.log('deserialize');
  console.log(userid);
  User.findOne({
    where: {
      id: userid
    }
  }).then(user => {
    console.log('deserialized');
    return cb(null, user);
  }, err => {
    if (err) {
      return cb(err);
    }
  });
});

/*
 * Connect new routes files here
 */

app.use("/", routes);
app.use("/robot", robotRoutes);
app.use("/session", sessionRoutes);
app.use("/app", appRoutes);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err,
      title: "error"
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
    title: "error"
  });
});



// var myVar = setInterval(myTimer, 300);

// myTimer();

function myTimer() {
    // EXAMPLE COMMAND MESSAGE:
    var cM = {
    "message_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
    "message_type": "command",
    "robot_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
    "timestamp": 1509748526.3482552,
    "configuration_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
    "session_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
    "instructions": [
        {
        "value": 0.10666666666666667,
        "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
        "ttl": 1.412,
        "type": "static"
        },
        {
        "value": 0.10666666666666667,
        "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
        "ttl": 1.412,
        "type": "static"
        },
        {
        "value": 0.10666666666666667,
        "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
        "ttl": 1.412,
        "type": "static"
        }
    ]
    }
    console.log(typeof(cM));
    // while(1);
    mq.enqueue(cM, 'demo-cmd');
}

module.exports = app;
