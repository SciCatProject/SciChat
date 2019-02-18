"use strict";

const AbstractService = require("./AbstractService");
const sdk = require("matrix-js-sdk");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MatrixService extends AbstractService {
  constructor() {
    super();
    this._client;
    this._events;
    this._rooms;
    this._timeline;
  }

  getEvents() {
    wait(5000).then(() => {
      return this._events;
    });
  }

  getRooms() {
    wait(5000).then(() => {
      return this._rooms;
    });
  }

  getTimeline() {
    wait(5000).then(() => {
      return this.timeline;
    });
  }

  createClient() {
    this._client = sdk.createClient({
      baseUrl: this._baseUrl,
      accessToken: this._accessToken,
      userId: this._userId
    });
    return this._client;
  }

  startClient() {
    this._client.startClient();
  }

  stopClient() {
    wait(3000).then(() => this._client.stopClient());
  }

  sync() {
    this._client.on("sync", async (state, prevState, data) => {
      switch (state) {
        case "CATCHUP":
          console.log(state + ": Connection found, retrying sync");
          break;
        case "ERROR":
          console.log(state + ": Could not connect to server");
          break;
        case "PREPARED":
          console.log(state);
          this._rooms = await this._client.getRooms();
          this._rooms.forEach(async room => {
            await this._client.scrollback(room);
            this._timeline = await room.getLiveTimeline();
            this._events = await this._timeline.getEvents();
          });
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

  printChatLog() {
    super.printChatLog();
  }

  findMessagesByDate(date) {
    super.findMessagesByDate(date);
  }

  findMessagesByDateRange(startDate, endDate) {
    super.findMessagesByDateRange(startDate, endDate);
  }

  _setTimeStampToStartOfDay(event) {
    return super._setTimeStampToStartOfDay(event);
  }

  _printFormattedMessage(event) {
    if (event.getType() === "m.room.message") {
      let [messageDate, messageTime] = this._formatTimeStamp(event);

      if (event.event.sender === this.userId) {
        console.log(
          `[${messageDate}, ${messageTime}] ${event.sender.name} >>> ${
            event.event.content.body
          }`
        );
      } else {
        console.log(
          `[${messageDate}, ${messageTime}] ${event.sender.name} <<< ${
            event.event.content.body
          }`
        );
      }
    }
  }

  _formatTimeStamp(event) {
    return super._formatTimeStamp(event);
  }
};
