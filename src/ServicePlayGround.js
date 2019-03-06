"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findMessagesByRoom("ERIC").then(messages => {
  client.printFormattedMessages(messages);
});
