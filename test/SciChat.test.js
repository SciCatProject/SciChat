"use strict";

const chai = require("chai");
const expect = chai.expect;

const MockService = require("../src/MockService");
const service = new MockService();

describe("Unit tests for created services", function() {
  describe("#createRoom()", function() {
    it("should create a new room named ERIC", function(done) {
      let opts = {
        room_alias_name: "ERIC",
        visibility: "public",
        invite: ["@henrik.johansson712:matrix.org"],
        name: "ERIC",
        topic: "Log for events at ESS ERIC"
      };
      expect(service.getRooms()).to.have.length(1);
      let newRoom = service.createRoom(opts);
      expect(newRoom).to.be.an("object");
      expect(newRoom.name).to.equal("ERIC");
      expect(service.getRooms()).to.have.length(2);
      done();
    });
  });

  describe("#printChatLog()", function() {
    it("should return an array containing the entire chatlog for a room", function(done) {
      let messages = service.printChatLog();
      expect(messages).to.be.an("array").that.is.not.empty;
      messages.forEach(message => {
        expect(message.event.type).to.equal("m.room.message");
      });
      done();
    });
  });

  describe("#findMessagesByRoom()", function() {
    it("should return an object containing roomId and an array of messages for the room `First room`", function(done) {
      let roomName = "First room";
      let messagesByRoom = service.findMessagesByRoom(roomName);
      expect(messagesByRoom).to.be.an("object").that.is.not.empty;
      messagesByRoom.messages.forEach(message => {
        expect(message.event.type).to.equal("m.room.message");
        expect(message.event.room_id).to.equal(messagesByRoom.roomId);
      });
      done();
    });
  });

  describe("#findMessagesByRoomAndDate()", function() {
    it("should return an object containing roomId for the room `First room` and an array of messages sent on 4 Feb 2019", function(done) {
      let roomName = "First room";
      let requestDate = new Date("04 Feb 2019");
      let messagesByRoomAndDate = service.findMessagesByRoomAndDate(
        roomName,
        requestDate
      );
      expect(messagesByRoomAndDate).to.be.an("object").that.is.not.empty;
      messagesByRoomAndDate.messages.forEach(message => {
        expect(message.event.type).to.equal("m.room.message");
        let messageTimeStamp = service._setTimeStampToStartOfDay(message);
        expect(messageTimeStamp.getTime()).to.equal(requestDate.getTime());
        expect(message.event.room_id).to.equal(messagesByRoomAndDate.roomId);
      });
      done();
    });
  });

  describe("#findMessagesByRoomAndDateRange()", function() {
    it("should return an object containing roomID for the room `First room` and an array of messages sent between 4 Feb 2019 and 5 Feb 2019", function(done) {
      let roomName = "First room";
      let requestStartDate = new Date("04 Feb 2019");
      let requestEndDate = new Date("05 Feb 2019");
      let messagesByRoomAndDateRange = service.findMessagesByRoomAndDateRange(
        roomName,
        requestStartDate,
        requestEndDate
      );
      expect(messagesByRoomAndDateRange).to.be.an("object").that.is.not.empty;
      messagesByRoomAndDateRange.messages.forEach(message => {
        expect(message.event.type).to.equal("m.room.message");
        let messageTimeStamp = service._setTimeStampToStartOfDay(message);
        expect(messageTimeStamp.getTime())
          .to.be.at.least(requestStartDate.getTime())
          .and.not.greaterThan(requestEndDate.getTime());
      });
      done();
    });
  });

  describe("#findMessagesByDate()", function() {
    it("should return an array containing all messages in a room sent on 4 Feb 2019", function(done) {
      let requestDate = new Date("04 Feb 2019");
      let messages = service.findMessagesByDate(requestDate);
      expect(messages).to.be.an("array").that.is.not.empty;
      messages.forEach(message => {
        expect(message.event.type).to.equal("m.room.message");
        let messageTimeStamp = service._setTimeStampToStartOfDay(message);
        expect(messageTimeStamp.getTime()).to.equal(requestDate.getTime());
      });
      done();
    });
  });

  describe("#findMessagesByDateRange()", function() {
    it("should return an array containing all messages in a room sent between 4 Feb 2019 and 5 Feb 2019", function(done) {
      let requestStartDate = new Date("04 Feb 2019");
      let requestEndDate = new Date("05 Feb 2019");
      let messages = service.findMessagesByDateRange(
        requestStartDate,
        requestEndDate
      );
      expect(messages).to.be.an("array").that.is.not.empty;
      messages.forEach(message => {
        let messageTimeStamp = service._setTimeStampToStartOfDay(message);
        expect(messageTimeStamp.getTime())
          .to.be.at.least(requestStartDate.getTime())
          .and.not.greaterThan(requestEndDate.getTime());
      });
      done();
    });
  });
});
