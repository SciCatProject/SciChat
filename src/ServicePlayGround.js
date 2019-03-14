"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

client.findUserInfoByUserName("scicatbot").then(userInfo => {
  console.log(userInfo);
});
