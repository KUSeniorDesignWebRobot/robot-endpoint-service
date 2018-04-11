const express = require("express");
const router = express.Router();
const mq = require("../controllers/MessageQueue");
const state = require("../controllers/StateManager");
const RobotSession = require("../controllers/RobotSession");
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");

router.post("/", (req, res) => {
  console.log("POST /session/ just happened");
  sessionId = uuidv4();
  sessionToken = crypto.randomBytes(48).toString("hex");
  robotSession = new RobotSession(sessionId);
  state.setSessionValue(sessionId, "sessionToken", sessionToken);
  state.setSessionValue(sessionId, "RobotSession", robotSession);

  responseObject = {
    acknowledged: true,
    sessionId: sessionId,
    sessionToken: sessionToken
  };
  res.send(responseObject);
});

router.post("/:id", (req, res) => {
  sessionId = req.params.id;
  console.log("POST /session/" + sessionId + " just happened");

  if (state.sessionExists(sessionId)) {
    sessionToken = crypto.randomBytes(48).toString("hex");
  robotSession = new RobotSession(sessionId);
  state.setSessionValue(sessionId, "sessionToken", sessionToken);
  state.setSessionValue(sessionId, "RobotSession", robotSession);

  responseObject = {
    acknowledged: true,
    sessionId: sessionId,
    sessionToken: sessionToken
  };
  res.send(responseObject);
  } else {
    sessionToken = crypto.randomBytes(48).toString("hex");
    robotSession = new RobotSession(sessionId);
    state.setSessionValue(sessionId, "sessionToken", sessionToken);
    state.setSessionValue(sessionId, "RobotSession", robotSession);

    responseObject = { acknowledged: true, sessionId: sessionId, sessionToken: sessionToken };
    res.send(responseObject);
  }
});

router.get("/:id", (req, res) => {
  queueId = req.params.id;
  console.log("GET /message/" + queueId + " just happened");

  message = mq.dequeue(req.params.id);
  res.send(message);
});

router.get("/", (req, res) => {
  res.send('sup');
});

module.exports = router;
