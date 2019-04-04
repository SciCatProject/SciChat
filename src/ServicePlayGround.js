"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findMessagesByRoom("ERIC").then(res => {
  console.log(res);
});
