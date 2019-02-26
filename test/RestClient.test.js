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
    it("should return an object containing user data", async function() {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let userData = await client.login();
      expect(userData).to.be.an("object");
      expect(userData).to.have.property("user_id");
      expect(userData.user_id)
        .to.be.a("string")
        .that.matches(/^@+?/);
      expect(userData).to.have.property("access_token");
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
    it("should return an array containing an object with roomId and roomEvents", async function() {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let events = await client.sync();
      expect(events)
        .to.be.an("array")
        .with.length(3);
      events.forEach(event => {
        expect(event).to.have.all.keys("roomId", "roomEvents");
        expect(event.roomEvents).to.be.an("array");
      });
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
    it("should return an object containing the room_id of the new room", async function() {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let newRoom = await client.createRoom();
      expect(newRoom)
        .to.be.an("object")
        .that.has.key("room_id");
      expect(newRoom.room_id).to.match(/^!+?/);
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
    it("should return an array containing information about all rooms", async function() {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let allRooms = await client.findAllRooms();
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
    it("should return an object with the event_id of the message that was sent", async function() {
      const MatrixRestClient = require("../src/MatrixRestClient");
      const client = new MatrixRestClient();
      let messageData = {
        roomName: "ERIC",
        message: "Hello ERIC!"
      };
      let messageResponse = await client.sendMessageToRoom(messageData);
      expect(messageResponse)
        .to.be.an("object")
        .that.has.key("event_id");
      expect(messageResponse.event_id).to.match(/^\$+?/);
    });
  });
});
