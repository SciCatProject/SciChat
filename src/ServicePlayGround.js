"use strict";

const MatrixService = require("./MatrixService");

const service = new MatrixService();

service.createClient();

let rooms = service.onSync();

console.log(rooms);

service.startClient();

setTimeout(() => {
  service.stopClient();
  process.exit();
}, 5000);