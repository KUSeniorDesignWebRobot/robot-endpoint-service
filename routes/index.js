const express = require('express');
const router = express.Router();
const passport = require("passport");
const models = require("../models");
const User = models.User;
const UserController = require("../controllers/User");
const checkAuth = require("../controllers/Auth");

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {'title': 'STV Robotics: Login', messages: {'info': req.flash('info'), 'warning': req.flash('warning'), 'error': req.flash('error')}});
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/',
    failureFlash: true
  }));

router.get('/register', (req, res) => {
  res.render('register', {'title': 'STV Robotics: Register', messages: {'info': req.flash('info'), 'warning': req.flash('warning'), 'error': req.flash('error')}});
});

router.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(username);
  console.log(password);
  User.count({where:{username:username}}).then(count => {
    console.log(count);
    if (count === 0) {
      UserController.createUser(username, password);
      req.flash('info', 'Created user');
      res.redirect('/');
    } else {
      res.render('register', {'title': 'STV Robotics: Register', messages: {'info': req.flash('info'), 'warning': req.flash('warning'), 'error': req.flash('error')}});
    }
  });
});
//
router.get('/app', checkAuth,
  (req, res) => {
    console.log(req.session);
    res.render('app', {'title': 'STV Robotics'});
  });

module.exports = router;
