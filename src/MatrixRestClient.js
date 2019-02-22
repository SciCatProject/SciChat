"use strict";

const requestPromise = require("request-promise");
const authData = require("./AuthData");

const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;
const password = authData.password;

let postLoginOptions = {
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

let getSync = {
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

requestPromise(getSync)
  .then(response => {
    events =
      response.rooms.join["!GZrqPFfcDEoMHVfNZk:localhost"].timeline.events;
    // console.log(response.rooms.join["!GZrqPFfcDEoMHVfNZk:localhost"].timeline.events);
    // console.log(response.user_id);
    // console.log(response.access_token);
    // myAccessToken = response.access_token;
    // console.log(myAccessToken);
  })
  .catch(err => {
    console.log("Error: " + err);
  });

setTimeout(() => {
  events.forEach(event => {
    if (event.type === "m.room.message") {
      console.log(event.content.body);
    }
  });
}, 5000);

// console.log(accessToken);
