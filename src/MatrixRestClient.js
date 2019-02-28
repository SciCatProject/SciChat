"use strict";

const requestPromise = require("request-promise");
const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;
const password = authData.password;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = class MatrixRestClient {
  constructor() {
    this._baseUrl = baseUrl;
    this._accessToken = accessToken;
    this._userId = userId;
    this._password = password;
    this._events = [];
    this._rooms;
    this._userData;
  }

  createRoom() {
    return new Promise((resolve, reject) => {
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

      requestPromise(options)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          console.error("Error: " + err);
        });
    });
  }

  findAllRooms() {
    return new Promise((resolve, reject) => {
      let options = {
        method: "GET",
        uri: this._baseUrl + "/_matrix/client/r0/publicRooms",
        headers: {
          Authorization: "Bearer " + this._accessToken
        },
        rejectUnauthorized: false,
        json: true
      };

      requestPromise(options)
        .then(response => {
          resolve(response.chunk);
        })
        .catch(err => {
          console.error("Error: " + err);
        });
    });
  }

  findEventsByRoom() {
    console.log("Retrieving events...");
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

    requestPromise(options)
      .then(response => {
        this._rooms = Object.keys(response.rooms.join);
        this._rooms.forEach(room => {
          this._events.push({
            roomId: room,
            roomEvents: response.rooms.join[room].timeline.events
          });
        });
        console.log("Sync succesful");
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  sendMessageToRoom({ roomName, message }) {
    return Promise.resolve(this.findAllRooms())
      .then(allRooms => {
        let roomId;
        console.log("Inside sendMessage: " + allRooms);
        allRooms.forEach(room => {
          console.log("Inside sendMessage for-loop: " + room);
          if (room.name.toLowerCase() === roomName.toLowerCase()) {
            console.log("Inside sendMessage if-statement: " + room.room_id);
            roomId = room.room_id;
          }
        });
        console.log("roomId from first then in sendMessage: " + roomId);

        let options = {
          method: "PUT",
          uri:
            this._baseUrl +
            `/_matrix/client/r0/rooms/${roomId}/state/m.room.message`,
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

  async login() {
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

    await requestPromise(options)
      .then(response => {
        this._userData = response;
      })
      .catch(err => {
        console.error("Error: " + err);
      });
    return this._userData;
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

    requestPromise(options)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  sync() {
    console.log("Syncing...");
    return new Promise((resolve, reject) => {
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

      requestPromise(options)
        .then(response => {
          let room_ids = Object.keys(response.rooms.join);
          room_ids.forEach(room_id => {
            this._events.push({
              roomId: room_id,
              roomEvents: response.rooms.join[room_id].timeline.events
            });
          });
          resolve(this._events);
          console.log("Sync succesful");
        })
        .catch(err => {
          console.error("Error: " + err);
        });
    });
  }
};
