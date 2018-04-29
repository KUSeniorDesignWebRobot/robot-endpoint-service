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
        'title': 'STV Robotics',
        robots: robots,
        messages: {
          'info': req.flash('info'),
          'warning': req.flash('warning'),
          'error': req.flash('error')
        }
      });
    });
  });

// delete plz
router.get('/plz', checkAuth, (req, res) => {
  res.render('app/session', {
    robot: {
      name: 'jim',
      id: 'asdf',
      RobotId: 'asdfgh'
    },
    title: 'plz',
    messages: {
      'info': req.flash('info'),
      'warning': req.flash('warning'),
      'error': req.flash('error')
    }
  });
});


router.get('/session/:robotid', checkAuth, (req, res) => {
  UserController.getRobots(req.user).then(robots => {
    let robot = robots.find(robot => robot.id === req.params.robotid && robot.active);
    if (robot !== undefined) {
      res.render('session', {
        robot: robot,
        messages: {
          'info': req.flash('info'),
          'warning': req.flash('warning'),
          'error': req.flash('error')
        }
      });
    } else {
      req.flash('error', 'No active robot with that ID is registered to you');
      res.redirect('/app');
    }
  });
});

module.exports = router;
