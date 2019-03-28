"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findRoomMembers("ERIC").then(response => {
  console.log(response);
});
