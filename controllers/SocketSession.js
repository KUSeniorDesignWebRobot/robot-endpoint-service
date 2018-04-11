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
    sessionId = data["sessionId"];
    sessionToken = data["sessionToken"];
    if (state.getSessionValue(sessionId, "sessionToken") == sessionToken) {
      this.sessionId = sessionId;

      state.setSessionValue(sessionId, "SocketSession", this);
      mq.subscribe(sessionId + "-rep", this.reportMessage.bind(this));
      this.socket.emit("establish", { acknowledged: "true" });
      this.established = true;
    } else {
      this.socket.emit("establish", {
        acknowledged: false,
        reason: "invalid sessionToken"
      });
    }
  }

  commandMessage(commandMessage) {
    if (this.established) {
      mq.enqueue(commandMessage, this.sessionId + "-cmd");
    }
  }

  reportMessage(reportMessage) {
    if (this.established) {
      console.log('reportMessage!!');
      this.socket.emit("reportMessage", reportMessage);
    }
  }

  close() {
    if (this.established) {
      this.socket.emit("close");
      mq.enqueue({ type: "close" }, this.sessionId + "-cmd");
      state.clearSessionValue(this.sessionId, "SocketSession");
    }
  }
}

module.exports = SocketSession;
