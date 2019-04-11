"use strict";

const MatrixRestClient = require("./MatrixRestClient");
const client = new MatrixRestClient();

let savePath = `${__dirname}/temp/SciCatLogo.png`;

client.downloadImageFromRoom("ERIC", "SciCatLogo.png", savePath).then(res => {
  console.log(res);
});
