"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let messageData = {
  roomName: "ERIC",
  message: "Hello ERIC!"
};

client.sync().then(eventList => {
  eventList.forEach(event => {
    if (event.roomId === "!vsaQURyAlhfBlxejio:localhost") {
      console.log(event.roomEvents);
    }
  });
});

client.findAllRooms().then(response => {
  console.log(response);
});
