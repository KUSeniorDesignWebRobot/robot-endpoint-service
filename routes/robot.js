const express = require("express");
const router = express.Router();
const state = require("../controllers/StateManager");
const models = require("../models");
const User = models.User;
const Robot = models.Robot;
const UserController = require("../controllers/User");
const checkAuth = require("../controllers/Auth");


router.post('/', checkAuth,
  (req, res) => {
    let user = req.user;
    let robotId = req.body.id;
    let name = req.body.name;

    Robot.create({
      UserId: user.id,
      RobotId: robotId,
      name: name
    }).then(robot => {
      req.flash('info', 'Registered robot');
      res.redirect('/app');
    });
  });


module.exports = router;
