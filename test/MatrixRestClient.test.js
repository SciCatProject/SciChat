"use strict";

const bluebird = require("bluebird");
const chai = require("chai");
const expect = chai.expect;
const mockery = require("mockery");

const mockStubs = require("./MockStubs");

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

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an object containing user data", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.login().then(userData => {
        expect(userData).to.be.an("object");
        expect(userData).to.have.property("user_id");
        expect(userData.user_id)
          .to.be.a("string")
          .that.matches(/^@+?/);
        expect(userData).to.have.property("access_token");
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

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an array containing an object with roomId and roomEvents", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.sync().then(events => {
        expect(events)
          .to.be.an("array")
          .with.length(3);
        events.forEach(event => {
          expect(event).to.have.all.keys("roomId", "roomEvents");
          expect(event.roomEvents).to.be.an("array");
        });
      });
      done();
    });
  });

  describe("#createRoom()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.createRoomResponse;
        return bluebird.resolve(response);
      });

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an object containing the room_id of the new room", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.createRoom().then(newRoom => {
        expect(newRoom)
          .to.be.an("object")
          .that.has.key("room_id");
        expect(newRoom.room_id).to.match(/^!+?/);
      });
      done();
    });
  });

  describe("#findRoomByName()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.findRoomByNameResponse;
        return bluebird.resolve(response);
      });

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an object containing information on the room `ERIC`", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.findRoomByName("ERIC").then(room => {
        expect(room).to.be.an("object");
        expect(room).to.have.property("canonical_alias");
        expect(room).to.have.property("name");
        expect(room).to.have.property("room_id");
        expect(room.canonical_alias).to.match(/^#+?/);
        expect(room.name).to.equal("ERIC");
        expect(room.room_id).to.match(/^!+?/);
      });
      done();
    });
  });

  describe("#findAllRooms()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.findAllRoomsResponse;
        return bluebird.resolve(response);
      });

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an array containing information about all rooms", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.findAllRooms().then(allRooms => {
        expect(allRooms).to.be.an("array");
        allRooms.forEach(room => {
          expect(room).to.be.an("object");
          expect(room).to.have.property("canonical_alias");
          expect(room).to.have.property("name");
          expect(room).to.have.property("room_id");
          expect(room.canonical_alias).to.match(/^#+?/);
          expect(room.room_id).to.match(/^!+?/);
        });
      });
      done();
    });
  });

  describe("#findEventsByRoom()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.findEventsByRoomResponse;
        return bluebird.resolve(response);
      });

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an object containing roomId and an array contatining all events for room `ERIC`", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      client.findEventsByRoom("ERIC").then(room => {
        expect(room).to.be.an("object");
        expect(room).to.have.property("roomId");
        expect(room.roomId).to.match(/^!+?/);
        expect(room).to.have.property("events");
        expect(room.events).to.be.an("array");
        room.events.forEach(event => {
          expect(event).to.have.property("event_id");
          expect(event.event_id).to.match(/^\$+?/);
        });
      });
      done();
    });
  });

  describe("#sendMessageToRoom()", function() {
    before(function(done) {
      mockery.enable({
        useCleanCache: true
      });

      mockery.registerMock("request-promise", function() {
        let response = mockStubs.sendMessageToRoomResponse;
        return bluebird.resolve(response);
      });

      mockery.registerAllowables(["../src/MatrixRestClient", "./AuthData"]);

      done();
    });
    it("should return an object with the event_id of the message that was sent", function(done) {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let messageData = {
        roomName: "ERIC",
        message: "Hello ERIC!"
      };
      client.sendMessageToRoom(messageData).then(messageResponse => {
        expect(messageResponse)
          .to.be.an("object")
          .that.has.key("event_id");
        expect(messageResponse.event_id).to.match(/^\$+?/);
      });
      done();
    });
  });
});
