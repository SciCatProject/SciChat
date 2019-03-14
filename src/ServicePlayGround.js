"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findImageByRoomAndFilename("ERIC", "myImage.jpg").then(response => {
  console.log(response);
});
