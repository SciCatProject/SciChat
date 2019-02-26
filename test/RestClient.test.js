"use strict";

const bluebird = require("bluebird");
const chai = require("chai");
const expect = chai.expect;
const mockery = require("mockery");

const authData = require("../src/AuthData");
const baseUrl = authData.baseUrl;
const accessToken = authData.accessToken;
const userId = authData.userId;
const password = authData.password;

const mockStubs = require("./MockStubs");

let testLogin = {
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

let testSync = {
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

afterEach(function(done) {
  mockery.disable();
  mockery.deregisterAll();
  done();
});

describe("Unit tests for the rest client", function() {
  describe("#login()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.loginResponse;
        return bluebird.resolve(response);
      });

      done();
    });
    it("should return an object containing user data", function(done) {
      const requestPromise = require("request-promise");
      requestPromise(testLogin)
        .then(response => {
          let userData = response;
          expect(userData).to.be.an("object");
          expect(userData).to.have.property("userId");
          expect(userData.userId).to.be.a("string").that.matches(/^@+?/);
          expect(userData).to.have.property("access_token");
        })
        .catch(err => {
          console.error("Error: " + err);
        });
      done();
    });
  });

  describe("#sync()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.syncResponse;
        return bluebird.resolve(response);
      });

      done();
    });
    it("should return a json object containing information about the rooms on the server", function(done) {
      const requestPromise = require("request-promise");
      let events = [];
      requestPromise(testSync)
      .then(response => {
        let rooms = Object.keys(response.rooms.join);
        rooms.forEach(room => {
          events.push({
            roomId: room,
            roomEvents: response.rooms.join[room].timeline.events
          });
        });
        expect(rooms).to.be.an("array");
        expect(rooms).to.contain.a("string").that.matches(/^!+?/);
        expect(events).to.contain.an("object").that.has.property("roomId").and.property("roomEvents");
        events.forEach(event => {
          expect(event.roomEvents).to.be.an("array");
        })
      })
      .catch(err => {
        console.error("Error: " + err);
      });
      done();
    });
  });
});
