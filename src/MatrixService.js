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

  _setEvents() {
    this.rooms.forEach(room => {
      this.events.push(room.getLiveTimeline().getEvents());
    });
  }

  getClient() {
    return this.client;
  }

  getRooms() {
    return this.rooms;
  }

  _setRooms() {
    this.rooms = this.client.getRooms();
    this.rooms.forEach(async function(room) {
      await this.client.scrollback(room);
    });
  }

  getTimeline() {
    return this.timeline;
  }

  _setTimeline() {
    this.rooms.forEach(room => {
      this.timeline.push(room.getLiveTimeline());
    });
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

  async sync() {
    await this.client.on("sync", (state, prevState, data) => {
      switch (state) {
        case "CATCHUP":
          console.log(state + ": Connection found, retrying sync");
          break;
        case "ERROR":
          console.log(state + ": Could not connect to server");
          break;
        case "PREPARED":
          console.log(state);
          let localClient = this.getClient();
          let localTimeline = this.getTimeline();
          let localEvents = this.getEvents();
          this.rooms = localClient.getRooms();
          this.rooms.forEach(async function(room) {
            await localClient.scrollback(room);
            localTimeline.push(room.getLiveTimeline());
            localEvents.push(room.getLiveTimeline().getEvents());
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
