"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findAllImagesByRoom("ERIC").then(response => {
  console.log(response);
});
