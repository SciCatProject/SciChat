"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client
  .sync()
  .then(() => {
    return client.sendMessageToRoom("Proposal01", "Testing bot message");
  })
  .then(res => {
    console.log(res);
  });
