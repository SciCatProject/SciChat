"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

let sendMessage = {
  roomName: "ERIC",
  message: "Message from synapse with new txnId, now using send."
};

client.sendMessageToRoom(sendMessage).then(response => {
  console.log(response);
});
