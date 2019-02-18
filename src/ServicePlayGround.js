"use strict";

// const MatrixService = require("./MatrixService");
// const service = new MatrixService();
const MockService = require("./MockService");
const service = new MockService();

// service.createClient();

// service.sync();

service.printChatLog();
// setTimeout(() => {
//   console.log(service._events[service._events.length - 1].event.content);
// }, 6000);

// service.startClient();

// service.stopClient();
