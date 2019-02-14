"use strict";

const MatrixService = require("./MatrixService");

const service = new MatrixService();

service.createClient();

service.startClient();

setTimeout(() => {
  service.stopClient();
  process.exit();
}, 5000);