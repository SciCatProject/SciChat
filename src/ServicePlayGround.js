"use strict";

const MatrixService = require("./MatrixService");
const service = new MatrixService();

service.createClient();

service.sync();

setTimeout(function() {
  service.printChatLog();
}, 5000);

service.startClient();

setTimeout(() => {
  service.stopClient();
}, 3000);
