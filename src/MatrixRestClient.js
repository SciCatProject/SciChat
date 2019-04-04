"use strict";

const requestPromise = require("request-promise");
const Utils = require("./Utils");
const utils = new Utils();

module.exports = class MatrixRestClient {
  constructor() {
    this._userId = "@scicatbot:scicat03.esss.lu.se";
    this._password = "scicatbot";
  }

  createRoom({ visibility, room_alias_name, name, topic }) {
    let roomDetails = {
      visibility: visibility,
      room_alias_name: room_alias_name,
      name: name,
      topic: topic
    };
    let options = utils.getRequestOptionsForMethod("createRoom", roomDetails);

    return requestPromise(options).catch(err => {
      console.error("Error in createRoom(): " + err);
    });
  }

  findAllRooms() {
    let options = utils.getRequestOptionsForMethod("findAllRooms");

    return requestPromise(options)
      .then(response => {
        return new Promise((resolve, reject) => {
          resolve(response.chunk);
        });
      })
      .catch(err => {
        console.error("Error in findAllRooms(): " + err);
      });
  }

  findRoomByName(requestName) {
    return this.findAllRooms()
      .then(allRooms => {
        let foundRoom;
        allRooms.forEach(room => {
          if (room.name.toLowerCase() === requestName.toLowerCase()) {
            foundRoom = room;
          }
        });
        return new Promise((resolve, reject) => {
          resolve(foundRoom);
        });
      })
      .catch(err => {
        console.error("Error in findRoomByName(): " + err);
      });
  }

  findRoomMembers(roomName) {
    return this.findRoomByName(roomName)
      .then(room => {
        let options = utils.getRequestOptionsForMethod(
          "findRoomMembers",
          room.room_id
        );

        return requestPromise(options);
      })
      .then(members => {
        return new Promise((resolve, reject) => {
          resolve(members.chunk);
        });
      })
      .catch(err => {
        console.error("Error in findRoomMemebers(): " + err);
      });
  }

  sendMessageToRoom({ roomName, message }) {
    return this.findRoomByName(roomName)
      .then(room => {
        let messageDetails = {
          roomId: room.room_id,
          message: message
        };
        let options = utils.getRequestOptionsForMethod(
          "sendMessageToRoom",
          messageDetails
        );

        return requestPromise(options);
      })
      .catch(err => {
        console.error("Error in sendMessageToRoom(): " + err);
      });
  }

  findEventsByRoom(roomName) {
    let roomId;
    return this.findRoomByName(roomName)
      .then(room => {
        roomId = room.room_id;
        return this.sync();
      })
      .then(syncResponse => {
        let syncRoomIds = Object.keys(syncResponse.rooms.join);
        let roomEvents = {};
        syncRoomIds.forEach(syncRoomId => {
          if (syncRoomId === roomId) {
            roomEvents.roomId = roomId;
            roomEvents.events = syncResponse.rooms.join[roomId].timeline.events;
          }
        });
        return new Promise((resolve, reject) => {
          resolve(roomEvents);
        });
      })
      .catch(err => {
        console.error("Error in findEventsByRoom(): " + err);
      });
  }

  findMessagesByRoom(roomName) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return utils.eventTypeIsMessage(event);
          })
        );
      })
      .catch(err => {
        console.error("Error in findMessagesByRoom(): " + err);
      });
  }

  findMessagesByRoomAndDate(roomName, date) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return (
              utils.eventTypeIsMessage(event) &&
              utils.eventDateEqualsRequestDate(event, date)
            );
          })
        );
      })
      .catch(err => {
        console.error("Error in findMessagesByRoomAndDate(): " + err);
      });
  }

  findMessagesByRoomAndDateRange(roomName, startDate, endDate) {
    return this.findEventsByRoom(roomName)
      .then(roomEvents => {
        return Promise.all(
          roomEvents.events.filter(event => {
            return (
              utils.eventTypeIsMessage(event) &&
              utils.eventDateIsBetweenRequestDates(event, startDate, endDate)
            );
          })
        );
      })
      .catch(err => {
        console.error("Error in findMessagesByRoomAndDateRange()" + err);
      });
  }

  findAllImagesByRoom(roomName) {
    return this.findMessagesByRoom(roomName).then(messages => {
      return Promise.all(
        messages.filter(message => {
          return utils.messageTypeisImage(message);
        })
      );
    });
  }

  findImageByRoomAndFilename(roomName, filename) {
    return this.findMessagesByRoom(roomName).then(messages => {
      messages.forEach(message => {
        if (
          utils.messageTypeisImage(message) &&
          utils.messageBodyEqualsFilename(message, filename)
        ) {
          let urlData = {
            serverName: message.content.url.split(/\/+/)[1],
            mediaId: message.content.url.split(/\/+/)[2]
          };

          let options = utils.getRequestOptionsForMethod(
            "findImageByRoomAndFilename",
            urlData
          );
          console.log(options.uri);
          return requestPromise(options).catch(err => {
            console.error("Error in findImageByRoomAndFilename(): " + err);
          });
        }
      });
    });
  }

  login() {
    let options = utils.getRequestOptionsForMethod("login");
    options.body.identifier.user = this._userId;
    options.body.password = this._password;

    return requestPromise(options).catch(err => {
      console.error("Error in login(): " + err);
    });
  }

  whoAmI() {
    let options = utils.getRequestOptionsForMethod("whoAmI");

    return requestPromise(options).catch(err => {
      console.error("Error in whoAmI(): " + err);
    });
  }

  findUserInfoByUserName(userName) {
    let options = utils.getRequestOptionsForMethod(
      "findUserInfoByUserName",
      userName
    );

    return requestPromise(options).catch(err => {
      console.error("Error in findUserInfoByUserId(): " + err);
    });
  }

  sync() {
    let options = utils.getRequestOptionsForMethod("sync");

    return requestPromise(options).catch(err => {
      console.error("Error in sync(): " + err);
    });
  }
};
