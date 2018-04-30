const express = require('express');
const router = express.Router();
const passport = require("passport");
const models = require("../../models");
const User = models.User;
const Robot = models.Robot;
const UserController = require("../../controllers/User");
const RobotController = require("../../controllers/Robot");
const checkAuth = require("../../controllers/Auth");

router.get('/', checkAuth,
  (req, res) => {
    UserController.getRobots(req.user).then(robots => {
      res.render('app', {
        'title': 'STV Robotics: Home',
        robots: robots,
        messages: {
          'info': req.flash('info'),
          'warning': req.flash('warning'),
          'error': req.flash('error')
        },
        logged_in: true
      });
    });
  });


router.get('/session/:robotid', checkAuth, (req, res) => {
  UserController.getRobots(req.user).then(robots => {
    let robot = robots.find(robot => robot.id === req.params.robotid && robot.active);
    if (robot !== undefined) {
      res.render('app/session', {
        title: "STV Robotics: " + robot.name,
        robot: robot,
        messages: {
          'info': req.flash('info'),
          'warning': req.flash('warning'),
          'error': req.flash('error')
        },
        logged_in: true
      });
    } else {
      req.flash('error', 'No active robot with that ID is registered to you');
      res.redirect('/app');
    }
  });
});

module.exports = router;
