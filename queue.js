if (role == undefined) {
  role = "consumer";
}

RedisSMQ = require("rsmq");
rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6379, ns: "rsmq" });
rsmq.createQueue({ qname: "myqueue" }, function(err, resp) {
  console.log(err);
  console.log(resp);
  if (resp == 1) {
    console.log("Successfully created queue!");
  }
});

if (role === "consumer") {
  rsmq.receiveMessage({ qname: "myqueue" }, function(err, resp) {
    if (resp.id) {
      console.log("Message received.", resp);
    } else {
      console.log("No messages for me...");
    }
  });
} else if (role === "producer") {
  rsmq.sendMessage({ qname: "myqueue", message: "Hello World" }, function(
    err,
    resp
  ) {
    if (resp) {
      console.log("Message sent. ID:", resp);
    }
  });
}
