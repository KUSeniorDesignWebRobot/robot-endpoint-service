const express = require("express");
const router = express.Router();
const mq = require("../controllers/MessageQueue");
const state = require("../controllers/StateManager");
// const RobotSession = require("../controllers/RobotSession");
const RobotSession = require("../controllers/RobotSessionRD");
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");
const checkAuth = require("../controllers/Auth");

router.post("/", checkAuth, (req, res) => {
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

router.post("/:id", checkAuth, (req, res) => {
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

    responseObject = {
      acknowledged: true,
      sessionId: sessionId,
      sessionToken: sessionToken
    };
    res.send(responseObject);
  }
});


module.exports = router;
