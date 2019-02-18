"use strict";

const MatrixService = require("./MatrixService");
const service = new MatrixService();

service.createClient();

service.sync();

service.printChatLog();

service.startClient();

service.stopClient();
