const state = require("../controllers/StateManager");
const mq = require("../controllers/MessageQueue");
const messenger = require('../controllers/CurveRD');
const uuidv4 = require('uuid/v4');

class RobotSession {
  constructor(manifest) {
    this.sessionId = null;
    this.commandMessageQueueId = null;
    this.commandMessageAcknowledgementQueueId = null;
    this.reportMessageQueueId = null;
    this.manifest = manifest;
    this.intervalID = setInterval(this.checkAlive.bind(this), 1000, manifest);
    messenger.on('alive', this.aliveMessageReceived.bind(this));
    this.lastMessageReceivedTimestamp = Date.now();
    console.log(this.lastMessageReceivedTimestamp);
  }
  commandMessage(msg) {
    if(typeof(msg) === "string"){
      msg = JSON.parse(msg);
    }
    var robot_id = msg['robot_id'];
    this.lastMessageSentTimeStamp = Date.now();
    if(!messenger.send(robot_id, msg)){
      mq.enqueueToFront(msg, this.commandMessageQueueId, true);
    }
  }

  commandMessageAcknowledgement(msg){
    this.lastMessageReceivedTimestamp = Date.now();
    mq.enqueue(msg, this.commandMessageAcknowledgementQueueId);
  }

  reportMessage(msg) {
    mq.enqueue(msg, this.reportMessageQueueId);
  }

  attachSession(sessionID) {
    this.sessionId = sessionId;
    this.commandMessageQueueId = this.sessionId + "-cmd";
    this.commandMessageAcknowledgementQueueId = this.sessionId + "-cmd-ack";
    this.reportMessageQueueId = this.sessionId + "-rep";
    mq.subscribe(this.commandMessageQueueId, this.commandMessage.bind(this));
    messenger.on('message', this.commandMessageAcknowledgement.bind(this));
  }

  unattachSession() {
    if(this.sessionID != null && state.SessionExists(this.sessionID)) {
      var commandMessageQueueId = this.sessionID + "-cmd";
      var commandMessageAcknowledgementQueueId = this.sessionID + "-cmd-ack";
      var reportMessageQueueId = this.sessionID + "-rep";
      var commandMessagesRemoved = mq.filter(command => command['robot_id'] == robot_id, commandMessageQueueId);
      var commandMessageAcknowledgementsRemoved = mq.filter(command => command['robot_id'] == robot_id, commandMessageAcknowledgementQueueId);
      var reportMessagesRemoved = mq.filter(command => command['robot_id'] == robot_id, reportMessageQueueId);
      if(commandMessagesRemoved + commandMessageAcknowledgementsRemoved + reportMessagesRemoved > 0){
        console.log("Removed " + commandMessagesRemoved + " old command messages, " + commandMessageAcknowledgementsRemoved + " old acknowledgement messages, and " + reportMessagesRemoved + " old report messages found from session named '" + priorSession + "' belonging to robot named '" + robot_id + "'.");
      }
      else{
        console.log("No old messages found.");
      }
    }
    this.sessionID = null;
  }

  getSession(){
    return this.sessionID;
  }

  closeRobotSession(){
    this.unattachSession();
    this.stopAliveCheck();
    state.removeRobotById(this.manifest['robot_id']);
  }

  checkAlive(manifest){
    var lastTime = this.lastMessageReceivedTimestamp;
    this.lastMessageSentTimestamp = Date.now();
    if(this.lastMessageSentTimestamp - lastTime > 2000){
      console.log("Error: Connection timeout with Robot, no alive check message received for 2000 milliseconds");
      this.closeRobotSession();
    }

    var aliveMessage = {
        "message_id": uuidv4(),
        "message_type": "alive",
        "robot_id": manifest['robot_id'],
        "timestamp": this.lastMessageSentTimestamp,
        }
    messenger.send(manifest['robot_id'], aliveMessage);
  }

  stopAliveCheck(){
    clearInterval(this.intervalID);
  }

  aliveMessageReceived(json_parsed){
    if(json_parsed['robot_id'] === this.manifest['robot_id']){
      this.lastMessageReceivedTimestamp = Date.now();
    }
  }
}

module.exports = RobotSession;
