"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findMessagesByRoomAndDate("ERIC", "28 Feb 2019").then(messages => {
  client.printFormattedMessages(messages);
});
