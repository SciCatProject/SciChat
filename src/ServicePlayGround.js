"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findRoomMembers("ERIC").then(members => {
  members.forEach(member => {
    console.log(member);
  });
});
