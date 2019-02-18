"use strict";

const MatrixService = require("./MatrixService");
// const service = new MatrixService();

const MockService = require("./MockService");
const service = new MockService();

service.createClient();

service.sync();

service.printChatLog();

service.startClient();

service.stopClient();
