"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

client.findAllRooms();
