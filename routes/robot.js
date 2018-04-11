const express = require("express");
const router = express.Router();
const state = require("../controllers/StateManager");


/* GET home page. */
router.get("/", (req, res) => {
  console.log("GET /robot just happened");
  res.send('{"name":"robot-endpoint-service"}');
});

/**
 * DELETEME
 * Testing endpoint for sending report messages
 */
router.post("/:id", (req, res) => {
  let sessionId = req.params.id;
  let message = req.body;
  console.log('POST robot/' + sessionId + ' just happened');
  state.debug();
  let robotSession = state.getSessionValue(sessionId, 'RobotSession');
  robotSession.reportMessage(message);
  let responseObject = { acknowledged: true };
  res.send(responseObject);
});

module.exports = router;
