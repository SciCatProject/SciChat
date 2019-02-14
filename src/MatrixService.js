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

  onSync(callback, callbackObj) {
    this.client.on("sync", async function(state, prevState, data) {
      switch (state) {
        case "CATCHUP":
          console.log(state + ": Connection found, retrying sync");
          break;
        case "ERROR":
          console.log(state + ": Could not connect to server");
          break;
        case "PREPARED":
          console.log(state);
          await callback.apply(callbackObj);
          // setRooms();
          // printRooms();
          // printChatLog();
          // findMessagesByDate("04 Feb 2019");
          // findMessagesByDateRange("04 Feb 2019", "05 Feb 2019");
          break;
        case "RECONNECTING":
          console.log(state + ": Connection lost");
          break;
        case "STOPPED":
          console.log(state + ": Syncing stopped");
          break;
        case "SYNCING":
          console.log(state);
          break;
      }
    });
  }

  getRooms() {
    let rooms = this.client.getRooms();
    rooms.forEach(async function(room) {
      await this.client.scrollback(room);
    });
    return rooms;
  }
};
