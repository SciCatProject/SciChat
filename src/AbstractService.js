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

  updateRooms() {}

  createRoom() {}

  findMessagesByRoom() {}

  findMessagesByRoomAndDate() {}

  findMessagesByRoomAndDateRange() {}

  printChatLog() {}

  findMessagesByDate() {}

  findMessagesByDateRange() {}

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
