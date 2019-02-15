"use strict";

const sdk = require("matrix-js-sdk");
const authData = require("./AuthData");

let baseUrl = authData.baseUrl;
let accessToken = authData.accessToken;
let userId = authData.userId;

module.exports = class MatrixService {
  constructor() {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.userId = userId;
    this.client;
    this.events = [];
    this.rooms = [];
    this.timeline = [];
  }

  getEvents() {
    return this.events;
  }

  getClient() {
    return this.client;
  }

  getRooms() {
    return this.rooms;
  }

  getTimeline() {
    return this.timeline;
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

  sync() {
    this.client.on("sync", (state, prevState, data) => {
      switch (state) {
        case "CATCHUP":
          console.log(state + ": Connection found, retrying sync");
          break;
        case "ERROR":
          console.log(state + ": Could not connect to server");
          break;
        case "PREPARED":
          console.log(state);
          this.rooms = this.client.getRooms();
          this.rooms.forEach(async (room) => {
            await this.client.scrollback(room);
            this.timeline.push(room.getLiveTimeline());
            this.events.push(room.getLiveTimeline().getEvents());
          });
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
};
