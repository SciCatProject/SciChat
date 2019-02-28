"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let messageData = {
  roomName: "ERIC",
  message: "Testing sendMessageToRoom() yet again"
};

client.sync().then(response => {
  response.forEach(room => {
    if (room.roomId === "!vsaQURyAlhfBlxejio:localhost") {
      room.roomEvents.forEach(event => {
        console.log(new Date(event.origin_server_ts).toDateString());
      });
    }
  });
});
