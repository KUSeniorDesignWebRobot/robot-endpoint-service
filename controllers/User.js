const bCrypt = require("bcrypt-nodejs");
const models = require("../models");
const User = models.User;
const Robot = models.Robot;
const RobotController = require('./Robot');

module.exports = {
  createUser: function createUser(username, password) {
    let salt = bCrypt.genSaltSync();
    let hash = bCrypt.hashSync(password, salt);
    let myUser = User.build({
      username: username,
      password: hash,
      salt: salt
    });
    myUser.save();
    return myUser;
  },
  validPassword: function validPassword(user, password) {
    let hash = bCrypt.hashSync(password, user.salt);
    return user.password === hash;
  },
  getRobots: function getRobots(user) {
    let prom = new Promise((resolve, reject) => {
      user.getRobots().then(robots => {
        let robotList = robots.map(robot => {
          return {
            id: robot.id,
            RobotId: robot.RobotId,
            UserId: robot.UserId,
            name: robot.name,
            active: RobotController.isActive(robot)
          };
        });
        resolve(robotList);
      });
    });
    return prom;
  }
};
