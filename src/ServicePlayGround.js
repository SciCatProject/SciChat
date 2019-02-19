"use strict";

const MatrixService = require("./MatrixService");
const service = new MatrixService();

const MockService = require("./MockService");
// const service = new MockService();

service.createClient();

service.sync();

// let opts = {
//   room_alias_name: "ERIC",
//   visibility: "public",
//   invite: ["@henrik.johansson712:matrix.org"],
//   name: "ERIC",
//   topic: "Log for events at ESS ERIC"
// }

// service.createRoom(opts);

service.findMessagesByRoomAndDate("First room", "04 Feb 2019");

service.startClient();

service.stopClient();
