"use strict";

let sdk = require("matrix-js-sdk");
let authData = require("./AuthData");

let baseUrl = authData.baseUrl;
let accessToken = authData.accessToken;
let userId = authData.userId;

module.exports = class MatrixService {
  constructor() {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.userId = userId;
    this.client;
  }

  createClient() {
    this.client = sdk.createClient({
      baseUrl: this.baseUrl,
      accessToken: this.accessToken,
      userId: this.userId
    });
    return this.client;
  }

  startClient() {
    this.client.startClient();
  }

  stopClient() {
    this.client.stopClient();
  }
}
