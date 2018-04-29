const state = require('./StateManager');

module.exports = {
  isActive: function isActive(robot) {
    return state.robotExists(robot.RobotId);
  }
};
