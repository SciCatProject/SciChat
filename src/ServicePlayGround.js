"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findRoomByName("ERIC").then(res => {
  console.log(res);
});
