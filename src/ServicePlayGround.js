"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

let roomOptions = {
  visibility: "public",
  room_alias_name: "ERIC",
  name: "ERIC",
  topic: "Chat log for ESS ERIC"
};

client.findAllRooms().then(rooms => {
  console.log(rooms);
});
