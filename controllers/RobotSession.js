const state = require("../controllers/StateManager");
const mq = require("../controllers/MessageQueue");
const messenger = require('../controllers/Curve');

class RobotSession {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.commandMessageQueueId = this.sessionId + "-cmd";
    // console.log("this.commandMessageQueueId = " + this.commandMessageQueueId);
    this.commandMessageAcknowledgementQueueId = this.sessionId + "-cmd-ack";
    this.reportMessageQueueId = this.sessionId + "-rep";
    mq.subscribe(this.commandMessageQueueId, this.commandMessage.bind(this));
    messenger.on('message', this.commandMessageAcknowledgement.bind(this));
  }

  // right = from robot
  // left = from client

  commandMessage(msg) {
    // CHANGEME
    console.log(typeof(msg))
    if(typeof(msg) == typeof("yo")){
      msg = JSON.parse(msg);
    }
    // while(1);
    console.log(msg);
    console.log(typeof(msg));
    while(1);
    console.log(
      "got subscription, with size of left of: ",
      mq.size(this.commandMessageQueueId)
    );
    // console.log("Printing queue for key = " + this.commandMessageQueueId);
    // mq.printQueue(this.commandMessageQueueId);
    // mq.printQueue(this.commandMessageAcknowledgementQueueId);
    if (mq.size(this.commandMessageAcknowledgementQueueId) > 0) {
      messenger.send(JSON.stringify(msg));

      //-------------
      //TODO for the future we should do something with the acknowledgment message instead of
      //just dequeue.  Here, I'm throwing it up on the reportMessageQueue since it'switch
      //set up to play it out to the Front End Demo.
      var ackMsg = mq.dequeue(this.commandMessageAcknowledgementQueueId);
      mq.enqueue(JSON.parse(ackMsg), this.reportMessageQueueId);
      //-------------

      console.log("sent message: " + msg);
    } else {
      mq.enqueueToFront(msg, this.commandMessageQueueId, true);
    }
    console.log("got subscription - done!");
  }

  commandMessageAcknowledgement(msg) {
    console.log("got message, with size of left of: ", mq.size(this.commandMessageQueueId));
    console.log(JSON.parse(msg));
    mq.enqueue(msg, this.commandMessageAcknowledgementQueueId);
    if (mq.size(this.commandMessageQueueId) > 0) {
      messenger.send(JSON.stringify(mq.dequeue(this.commandMessageQueueId)));
      console.log("sent message");
    }
    console.log("got message - done!");
  }

  reportMessage(msg) {
    mq.enqueue(msg, this.reportMessageQueueId);
  }
}

module.exports = RobotSession;




// const messenger = require("./controllers/Curve");

// //EXAMPLE arrivale of command messages.  One everfy 2ms, for a total of 500 every second.
// var myVar = setInterval(myTimer, 2);
//
// function myTimer() {
//     // EXAMPLE COMMAND MESSAGE:
//     var cM = {
//     "message_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//     "message_type": "command",
//     "robot_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//     "timestamp": 1509748526.3482552,
//     "configuration_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//     "session_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//     "instructions": [
//         {
//         "value": 0.10666666666666667,
//         "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//         "ttl": 1.412,
//         "type": "static"
//         },
//         {
//         "value": 0.10666666666666667,
//         "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//         "ttl": 1.412,
//         "type": "static"
//         },
//         {
//         "value": 0.10666666666666667,
//         "actuator_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
//         "ttl": 1.412,
//         "type": "static"
//         }
//     ]
//     }
//     mq.enqueue(cM, 'left');
// }

// /*
//  * When a command is received, send it if an ack msg
//  * is waiting to be dequeued.
//  */

// mq.subscribe("left", msg => {
//   console.log("got subscription, with size of left of: ", mq.size("left"));
//   console.log(msg);
//   if (mq.size("right") > 0) {
//     messenger.send(JSON.stringify(msg));
//     mq.dequeue("right");
//     console.log("sent message");
//   } else {
//     mq.enqueue(msg, "left", true);
//   }
//   console.log("got subscription - done!");
// });

// /*
//  * When a message is received, send another message if available
//  * This will create a loop of acknowledgement messages in order to
//  * eat up the left queue.
//  */
// messenger.on("message", function commandMessage(msg) {
//   console.log("got message, with size of left of: ", mq.size("left"));
//   console.log(msg);
//   mq.enqueue(msg, "right");
//   if (mq.size("left") > 0) {
//     messenger.send(JSON.stringify(mq.dequeue("left")));
//     console.log("sent message");
//   }
//   console.log("got message - done!");
// });
