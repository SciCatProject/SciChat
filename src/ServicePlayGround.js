"use strict";

const MatrixService = require("./MatrixService");
const service = new MatrixService();

service.createClient();

service.sync();

setTimeout(function() {
  let rooms = service.getEvents();
  console.log(rooms);
}, 5000);

service.startClient();

setTimeout(() => {
  service.stopClient();
}, 3000);
