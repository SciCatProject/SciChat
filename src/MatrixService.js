"use strict";

const sdk = require("matrix-js-sdk");
const authData = require("./AuthData");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;

module.exports = class MatrixService {
  constructor() {
    this._baseUrl = baseUrl;
    this._accessToken = accessToken;
    this._userId = userId;
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
    wait(5000).then(() => {
      console.log("\nMessages:");

      this._events.forEach(event => {
        this._printFormattedMessage(event);
      });
    });
  }

  findMessagesByDate(date) {
    wait(5000).then(() => {
      let requestDate = new Date(date);
      console.log(`\nMessages sent on ${requestDate.toDateString()}:`);

      this._events.forEach(event => {
        let messageTimeStamp = this._setTimeStampToStartOfDay(event);

        if (messageTimeStamp.getTime() === requestDate.getTime()) {
          this._printFormattedMessage(event);
        }
      });
    });
  }

  findMessagesByDateRange(startDate, endDate) {
    wait(5000).then(() => {
      let requestStartDate = new Date(startDate);
      let requestEndDate = new Date(endDate);
      console.log(
        `\nMessages sent between ${requestStartDate.toDateString()} and ${requestEndDate.toDateString()}:`
      );

      this._events.forEach(event => {
        let messageTimeStamp = this._setTimeStampToStartOfDay(event);

        if (
          messageTimeStamp.getTime() >= requestStartDate.getTime() &&
          messageTimeStamp.getTime() <= requestEndDate.getTime()
        ) {
          this._printFormattedMessage(event);
        }
      });
    });
  }

  _setTimeStampToStartOfDay(event) {
    let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
    messageTimeStamp.setHours(0, 0, 0, 0);
    return messageTimeStamp;
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
    let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
    messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
    return messageTimeStamp.toISOString().split(/[T.]+/);
  }
};
