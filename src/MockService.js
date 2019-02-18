"use strict";

const AbstractService = require("./AbstractService");
const mockStubs = require("../test/MockStubs");
const events = mockStubs.events;
const rooms = mockStubs.rooms;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MockService extends AbstractService {
  constructor() {
    super();
    this._events = events;
    this._rooms = rooms;
    this._messages = [];
  }

  getEvents() {
    wait(5000).then(() => {
      return this._events;
    });
  }

  getRooms() {
    console.log("Called getRooms() from MockService.");
    return this._rooms;
  }

  getTimeline() {
    console.log("Called getTimeline() from MockService.");
  }

  createClient() {
    console.log("Called createClient() from MockService.");
  }

  startClient() {
    console.log("Called startClient() from MockService.");
  }

  stopClient() {
    wait(3000).then(() => console.log("Called stopClient() from MockService."));
  }

  sync() {
    console.log("Called sync() from MockService.");
    this.updateRooms();
  }

  updateRooms() {
    console.log("Called updateRooms() from MockService.");
  }

  createRoom(opts) {
    this._rooms.push(opts);
    return {
      room_alias_name: opts.room_alias_name,
      visibility: opts.visibility,
      invite: opts.invite,
      name: opts.name,
      topic: opts.topic
    };
  }

  printChatLog() {
    this._messages = [];
    console.log("\nMessages:");

    this._events.forEach(event => {
      this._printFormattedMessage(event);
    });
    return this._messages;
  }

  findMessagesByDate(date) {
    this._messages = [];
    let requestDate = new Date(date);
    console.log(`\nMessages sent on ${requestDate.toDateString()}:`);

    this._events.forEach(event => {
      let messageTimeStamp = this._setTimeStampToStartOfDay(event);

      if (messageTimeStamp.getTime() === requestDate.getTime()) {
        this._printFormattedMessage(event);
      }
    });
    return this._messages;
  }

  findMessagesByDateRange(startDate, endDate) {
    this._messages = [];
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
    return this._messages;
  }

  _setTimeStampToStartOfDay(event) {
    return super._setTimeStampToStartOfDay(event);
  }

  _printFormattedMessage(event) {
    if (event.event.type === "m.room.message") {
      this._messages.push(event);
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
