const state = require("../controllers/StateManager");
const mq = require("../controllers/MessageQueue");
const messenger = require('../controllers/CurveRD');

class HandshakeListener {
  constructor() {
    messenger.on('handshake', this.registerRobot.bind(this));
  }

  registerRobot(json_parsed) {
    var robot_id = json_parsed['robot_id'];
    var manifest = json_parsed['manifest'];

    if(state.robotExists(robot_id)){
      console.log(robot_id + " has prior connection.");
      priorSession = state.getRobotValue(robot_id, 'RobotSession');
      if(priorSession !== undefined){
        priorSession.unnattachSession();
        priorSession.stopAliveCheck();
      }
    }
    state.setRobotValue(robot_id, 'robotSession', new RobotSession());
    state.setRobotValue(robot_id, 'manifest', manifest);

    var handshake = {
      "message_id": json_parsed['message_id'],
      "message_type": "handshake"
    };

    messenger.send(robot_id, JSON.stringify(handshake));
    console.log(name + " has been authenticated and registered!");
  }
}

module.exports = HandshakeListener;
