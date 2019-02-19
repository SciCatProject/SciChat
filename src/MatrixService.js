"use strict";

const sdk = require("matrix-js-sdk");
const AbstractService = require("./AbstractService");
const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MatrixService extends AbstractService {
  constructor() {
    super();
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
          this.updateRooms();
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

  async updateRooms() {
    this._rooms = await this._client.getRooms();
    this._rooms.forEach(async room => {
      await this._client.scrollback(room);
      this._timeline = await room.getLiveTimeline();
      this._events = await this._timeline.getEvents();
    });
    console.log("Updated rooms.");
  }

  async createRoom(opts) {
    await this._client.createRoom(opts);
    console.log("Created new room");
    this.updateRooms();
  }

  findRoom(name) {
    let foundRoom;
    this._rooms.forEach(room => {
      if (room.name.toLowerCase() === name.toLowerCase()) {
        foundRoom = room;
      }
    });
    return foundRoom;
  }

  findMessagesByRoom(name) {
    wait(5000).then(async () => {
      console.log(`\nMessages sent in room ${name}:`);
      let room = this.findRoom(name);
      let roomEvents = await room.getLiveTimeline().getEvents();
      roomEvents.forEach(event => {
        this._printFormattedMessage(event);
      });
    });
  }

  findMessagesByRoomAndDate(name, date) {
    let requestDate = new Date(date);
    wait(5000).then(async () => {
      console.log(
        `\nMessages sent in room ${name} on ${requestDate.toDateString()}:`
      );
      let room = this.findRoom(name);
      let roomEvents = await room.getLiveTimeline().getEvents();
      roomEvents.forEach(event => {
        if (this._eventDateEqualsRequestDate(event, requestDate)) {
          this._printFormattedMessage(event);
        }
      });
    });
  }

  findMessagesByRoomAndDateRange(name, startDate, endDate) {
    let requestStartDate = new Date(startDate);
    let requestEndDate = new Date(endDate);
    wait(5000).then(async () => {
      console.log(
        `\nMessages sent in room ${name} between ${requestStartDate.toDateString()} and ${requestEndDate.toDateString()}:`
      );
      let room = this.findRoom(name);
      let roomEvents = await room.getLiveTimeline().getEvents();
      roomEvents.forEach(event => {
        if (
          this._eventDateIsBetweenRequestDates(
            event,
            requestStartDate,
            requestEndDate
          )
        ) {
          this._printFormattedMessage(event);
        }
      });
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
        if (this._eventDateEqualsRequestDate(event, requestDate)) {
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
        if (
          this._eventDateIsBetweenRequestDates(
            event,
            requestStartDate,
            requestEndDate
          )
        ) {
          this._printFormattedMessage(event);
        }
      });
    });
  }

  _eventDateEqualsRequestDate(event, requestDate) {
    let eventTimeStamp = this._setTimeStampToStartOfDay(event);
    if (eventTimeStamp.getTime() === requestDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  _eventDateIsBetweenRequestDates(event, requestStartDate, requestEndDate) {
    let eventTimeStamp = this._setTimeStampToStartOfDay(event);
    if (
      eventTimeStamp.getTime() >= requestStartDate.getTime() &&
      eventTimeStamp.getTime() <= requestEndDate.getTime()
    ) {
      return true;
    } else {
      return false;
    }
  }

  _setTimeStampToStartOfDay(event) {
    return super._setTimeStampToStartOfDay(event);
  }

  _printFormattedMessage(event) {
    if (event.getType() === "m.room.message") {
      let messageTimeStamp = this._formatTimeStamp(event);

      if (event.event.sender === this.userId) {
        console.log(
          `[${messageTimeStamp}] ${event.sender.name} >>> ${
            event.event.content.body
          }`
        );
      } else {
        console.log(
          `[${messageTimeStamp}] ${event.sender.name} <<< ${
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
