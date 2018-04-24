const state = require("../controllers/StateManager");
const mq = require("../controllers/MessageQueue");
const messenger = require('../controllers/CurveRD');

class RobotSession {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.commandMessageQueueId = this.sessionId + "-cmd";
    this.commandMessageAcknowledgementQueueId = this.sessionId + "-cmd-ack";
    this.reportMessageQueueId = this.sessionId + "-rep";
    mq.subscribe(this.commandMessageQueueId, this.commandMessage.bind(this));
    messenger.on('message', this.commandMessageAcknowledgement.bind(this));
    messenger.on('handshake', this.robotHandshakeCleanup.bind(this));
  }
  commandMessage(msg) {
    if(typeof(msg) == typeof("string")){
      msg = JSON.parse(msg);
    }
    var robot_id = msg['robot_id'];
    if(!messenger.send(msg)){
      mq.enqueueToFront(msg, this.commandMessageQueueId, true);
    }
  }

  commandMessageAcknowledgement(msg) {
    mq.enqueue(msg, this.commandMessageAcknowledgementQueueId);
  }

  reportMessage(msg) {
    mq.enqueue(msg, this.reportMessageQueueId);
  }

  robotHandshakeCleanup(name) {
    console.log(name + " has been authenticated and registered!");
    var i, cmd;
    for(i = 0; i < mq.size(this.commandMessageQueueId); i++) {
      cmd = mq.dequeue(this.commandMessageQueueId);
      if(cmd['robot_id'] == name) {
        console.log("OLD MESSAGE FOUND - REMOVING")
      }
      else{
        mq.enqueue(cmd, this.commandMessageQueueId, true);
      }
    }
  }
}

module.exports = RobotSession;
