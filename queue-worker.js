var RSMQWorker = require("rsmq-worker");
var worker = new RSMQWorker("myqueue", {
    interval: 0.05,
    maxReceiveCount: 100,
    invisibletime: 0,
    defaultDelay: 0
});

worker.on("message", function(msg, next, id) {
  // process your message
  console.log("Message id : " + id);
  console.log(msg);
  next();
});

// optional error listeners
worker.on("error", function(err, msg) {
  console.log("ERROR", err, msg.id);
});
worker.on("exceeded", function(msg) {
  console.log("EXCEEDED", msg.id);
});
worker.on("timeout", function(msg) {
  console.log("TIMEOUT", msg.id, msg.rc);
});

worker.start();


// options.interval: ( Number[] optional; default = [ 0, 1, 5, 10 ] ) An Array of increasing wait times in seconds. More details
// options.maxReceiveCount: ( Number optional; default = 10 ) Receive count until a message will be exceeded
// options.invisibletime: ( Number optional; default = 30 ) A time in seconds to hide a message after it has been received.
// options.defaultDelay: ( Number optional; default = 1 ) The default delay in seconds for for sending new messages to the queue.
// options.autostart: ( Boolean optional; default = false ) Autostart the worker on init
// options.timeout: ( Number optional; default = 3000 ) Message processing timeout in ms. So you have to call the next() method of message at least after e.g. 3000ms. If set to 0 it'll wait until infinity.