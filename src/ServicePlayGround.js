"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let messageData = {
  roomName: "ERIC",
  message: "Testing sendMessageToRoom() yet again"
};

client.whoAmI().then(response => {
  console.log(response);
});
