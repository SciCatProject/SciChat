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

  async createRoom() {
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

    await requestPromise(options)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  async findAllRooms() {
    let options = {
      method: "GET",
      uri: this._baseUrl + "/_matrix/client/r0/publicRooms",
      headers: {
        Authorization: "Bearer " + this._accessToken
      },
      rejectUnauthorized: false,
      json: true
    };

    let paginationToken;

    await requestPromise(options)
      .then(response => {
        console.log(response);
        paginationToken = response.next_batch;
      })
      .catch(err => {
        console.error("Error: " + err);
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

    requestPromise(options)
      .then(response => {
        this._userData = response;
      })
      .catch(err => {
        console.error("Error: " + err);
      });

    wait(5000).then(() => {
      console.log(this._userData);
    });
  }

  // getLoginOptions = {
  //   method: "GET",
  //   uri: baseUrl + "/_matrix/client/r0/login",
  //   rejectUnauthorized: false
  // };

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
        console.log(response);
        console.log(response.rooms.join["!GZrqPFfcDEoMHVfNZk:localhost"].state);
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
};
