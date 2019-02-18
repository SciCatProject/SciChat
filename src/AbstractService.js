"use strict";

const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class ServiceFactory {
  constructor() {
    this._baseUrl = baseUrl;
    this._accessToken = accessToken;
    this._userId = userId;
  }

  getEvents() {}

  getRooms() {}

  getTimeline() {}

  createClient() {}

  startClient() {}

  stopClient() {}

  sync() {}

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

  _printFormattedMessage() {}

  _formatTimeStamp(event) {
    let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
    messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
    return messageTimeStamp.toISOString().split(/[T.]+/);
  }
};
