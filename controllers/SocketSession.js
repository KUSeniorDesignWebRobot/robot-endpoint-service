const state = require("../controllers/StateManager");
const mq = require("../controllers/MessageQueue");

const io = state.getGlobalValue("io");

class SocketSession {
  constructor(socket) {
    this.socket = socket;
    this.socket.on("establish", this.establish.bind(this));
    this.socket.on("commandMessage", this.commandMessage.bind(this));
    this.socket.on("close", this.close);
    this.established = false;
    this.sessionId = undefined;
  }

  establish(data) {
    this.sessionId = data.sessionId;
    this.sessionToken = data.sessionToken;
    this.robotId = data.robotId;
    if (state.getSessionValue(sessionId, "sessionToken") == sessionToken) {
      this.sessionId = sessionId;

      if (state.robotExists(this.robotId)) {
        state.debug();
        let manifest = state.getRobotValue(this.robotId, 'manifest');
        let robotSession = state.getRobotValue(this.robotId, 'RobotSession');
        robotSession.attachSession(sessionId);
        this.robotSession = robotSession;

        state.setSessionValue(sessionId, "SocketSession", this);
        mq.subscribe(sessionId + "-rep", this.reportMessage.bind(this));
        this.socket.emit("establish", { acknowledged: "true", manifest: manifest });
        this.established = true;
      } else {
        this.socket.emit("establish", {
          acknowledged: false,
          reason: "robot with id " + this.robotId + " not found"
        });
      }

    } else {
      this.socket.emit("establish", {
        acknowledged: false,
        reason: "invalid sessionToken"
      });
    }
  }

  commandMessage(commandMessage) {
    if (this.established) {
      var key = this.sessionId + "-cmd";
      console.log('enqueue(' + commandMessage + ', ' + key + ')');
      mq.enqueue(commandMessage, key);
    }
  }

  reportMessage(reportMessage) {
    if (this.established) {
      console.log('reportMessage!!');
      this.socket.emit("reportMessage", reportMessage);
    }
  }

  close(instigator=false) {
    if (this.established) {
      this.socket.emit("close");
      state.clearSessionValue(this.sessionId, "SocketSession");
      if (instigator) {
        this.robotSession.unattachSession();
      }
    }
  }
}

module.exports = SocketSession;
