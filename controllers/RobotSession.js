const state = require('../controllers/StateManager');
const mq = require('../controllers/MessageQueue');

class RobotSession {
    constructor(sessionId) {
        this.sessionId = sessionId;
        mq.subscribe(this.sessionId + '-cmd', this.commandMessage);
    }

    commandMessage(msg) {
        // CHANGEME
        console.log(msg);
    }

    reportMessage(msg) {
        mq.enqueue(msg, this.sessionId + '-rep');
    }
}

module.exports = RobotSession;