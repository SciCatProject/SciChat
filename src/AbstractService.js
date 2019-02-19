"use strict";

module.exports = class AbstractService {
  constructor() {}

  getEvents() {}

  getRooms() {}

  getTimeline() {}

  createClient() {}

  startClient() {}

  stopClient() {}

  sync() {}

  updateRooms() {}

  createRoom() {}

  findRoom() {}

  findMessagesByRoom() {}

  findMessagesByRoomAndDate() {}

  findMessagesByRoomAndDateRange() {}

  printChatLog() {}

  findMessagesByDate() {}

  findMessagesByDateRange() {}

  _eventDateEqualsRequestDate() {}

  _eventDateIsBetweenRequestDates() {}

  _setTimeStampToStartOfDay(event) {
    let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
    messageTimeStamp.setHours(0, 0, 0, 0);
    return messageTimeStamp;
  }

  _printFormattedMessage() {}

  _formatTimeStamp(event) {
    let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
    messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
    return messageTimeStamp.toISOString().replace("T"," ").replace(/\.\w+/,"");
  }
};
