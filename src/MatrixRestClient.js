"use strict";

const requestPromise = require("request-promise");
const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;
const password = authData.password;

module.exports = class MatrixRestClient {
  constructor() {
    this._baseUrl = baseUrl;
    this._accessToken = accessToken;
    this._userId = userId;
    this._password = password;
  }

  createRoom() {
    let options = {
      method: "POST",
      uri: this._baseUrl + "/_matrix/client/r0/createRoom",
      headers: {
        Authorization: "Bearer " + this._accessToken
      },
      body: {
        visibility: "public",
        room_alias_name: "scicatrest",
        name: "SciCat Log from rest",
        topic: "Chat logging for SciCat",
        creation_content: {
          "m.federate": false
        }
      },
      rejectUnauthorized: false,
      json: true
    };

    return requestPromise(options).catch(err => {
      console.error("Error: " + err);
    });
  }

  findRoomByName(requestName) {
    return this.findAllRooms().then(allRooms => {
      let foundRoom;
      allRooms.forEach(room => {
        if (room.name.toLowerCase() === requestName.toLowerCase()) {
          foundRoom = room;
        }
      });
      return foundRoom;
    });
  }

  findAllRooms() {
    let options = {
      method: "GET",
      uri: this._baseUrl + "/_matrix/client/r0/publicRooms",
      headers: {
        Authorization: "Bearer " + this._accessToken
      },
      rejectUnauthorized: false,
      json: true
    };

    return requestPromise(options)
      .then(response => {
        return response.chunk;
      })
      .catch(err => {
        console.error("Error: " + err);
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
          return roomEvents;
        });
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  sendMessageToRoom({ roomName, message }) {
    return this.findRoomByName(roomName)
      .then(room => {
        let options = {
          method: "PUT",
          uri:
            this._baseUrl +
            `/_matrix/client/r0/rooms/${room.room_id}/state/m.room.message`,
          headers: {
            Authorization: "Bearer " + this._accessToken
          },
          body: {
            body: message,
            msgtype: "m.text"
          },
          rejectUnauthorized: false,
          json: true
        };
        return requestPromise(options);
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  login() {
    let options = {
      method: "POST",
      uri: this._baseUrl + "/_matrix/client/r0/login",
      body: {
        type: "m.login.password",
        identifier: {
          type: "m.id.user",
          user: this._userId
        },
        password: this._password
      },
      rejectUnauthorized: false,
      json: true
    };

    return requestPromise(options).catch(err => {
      console.error("Error: " + err);
    });
  }

  whoAmI() {
    let options = {
      method: "GET",
      uri: this._baseUrl + "/_matrix/client/r0/account/whoami",
      headers: {
        Authorization: "Bearer " + this._accessToken
      },
      body: {
        timeout: 5000
      },
      rejectUnauthorized: false,
      json: true
    };

    return requestPromise(options)
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  sync() {
    console.log("Syncing...");
    let options = {
      method: "GET",
      uri: this._baseUrl + "/_matrix/client/r0/sync",
      headers: {
        Authorization: "Bearer " + this._accessToken
      },
      body: {
        full_state: true,
        timeout: 5000
      },
      rejectUnauthorized: false,
      json: true
    };

    return requestPromise(options)
      .then(response => {
        console.log("Sync succesful");
        return response;
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }
};
