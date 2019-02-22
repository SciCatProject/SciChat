"use strict";

const requestPromise = require("request-promise");
const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;
const password = authData.password;

function login() {
  let options = {
    method: "POST",
    uri: baseUrl + "/_matrix/client/r0/login",
    body: {
      type: "m.login.password",
      identifier: {
        type: "m.id.user",
        user: userId
      },
      password: password
    },
    rejectUnauthorized: false,
    json: true
  };

  let userData;

  requestPromise(options)
    .then(response => {
      userData = response;
    })
    .catch(err => {
      console.error("Error: " + err);
    });
  setTimeout(() => {
    console.log(userData);
  }, 5000);
}

let getLoginOptions = {
  method: "GET",
  uri: baseUrl + "/_matrix/client/r0/login",
  rejectUnauthorized: false
};

let getWhoAmI = {
  method: "GET",
  uri: baseUrl + "/_matrix/client/r0/account/whoami",
  headers: {
    Authorization: "Bearer " + accessToken
  },
  rejectUnauthorized: false
};

function sync() {
  let options = {
    method: "GET",
    uri: baseUrl + "/_matrix/client/r0/sync",
    headers: {
      Authorization: "Bearer " + accessToken
    },
    body: {
      timeout: 5000
    },
    rejectUnauthorized: false,
    json: true
  };
  let events;

  requestPromise(options)
    .then(response => {
      events =
        response.rooms.join["!GZrqPFfcDEoMHVfNZk:localhost"].timeline.events;
    })
    .catch(err => {
      console.error("Error: " + err);
    });

  setTimeout(() => {
    events.forEach(event => {
      if (event.type === "m.room.message") {
        console.log(event.content.body);
      }
    });
  }, 5000);
}
