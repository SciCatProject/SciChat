"use strict";

const AbstractService = require("./AbstractService");
const mockStubs = require("../test/MockStubs");
const events = mockStubs.events;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MockService extends AbstractService {
  constructor() {
    super();
    this._events = events;
  }

  getEvents() {
    wait(5000).then(() => {
      return this._events;
    });
  }

  getRooms() {
    console.log("Called getRooms() from MockService.");
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
    let messages = [];
    if (event.event.type === "m.room.message") {
      messages.push(event);
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
    return messages;
  }

  _formatTimeStamp(event) {
    return super._formatTimeStamp(event);
  }
};
