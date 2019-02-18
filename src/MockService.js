"use strict";

const mockStubs = require("../test/MockStubs");
const events = mockStubs.events;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MockService {
  constructor() {
    this._events = events;
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
    if (event.event.type === "m.room.message") {
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
