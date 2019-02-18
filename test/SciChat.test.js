"use strict";

const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const request = require("supertest");

const authData = require("../src/AuthData");
const MockService = require("../src/MockService");
const service = new MockService();

describe("Simple test of function createClient using mock API", function() {
  describe("#printChatLog()", function() {
    it("should return an array containing the entire chatlog for a room", function(done) {
      let messages = service.printChatLog();
      console.log(messages);
      expect(messages).to.be.an("array");
      expect(messages[0].event.type).to.equal("m.room.message");
      done();
    });
  });

  // describe("#formatTimeStamp()", function() {
  //   it("should return an array of format [`yyyy-MM-dd`, `hh:mm:ss`, `ms`]", function(done) {
  //     let event = {
  //       event: {
  //         unsigned: {
  //           age: 1234567
  //         }
  //       }
  //     };
  //     service._formatTimeStamp(event);
  //     assert(service._formatTimeStamp.calledWith(event));
  //     expect(service._formatTimeStamp.returnValues[0])
  //       .to.be.an("array")
  //       .of.length(3);
  //     expect(SciChat.formatTimeStamp.returnValues[0][0]).to.match(
  //       /\d{4}-\d{2}-\d{2}/
  //     );
  //     done();
  //   });
  // });

  // describe.skip("#getRooms()", function() {
  //   it("should return an array of objects containing userId, roomId and room name", function(done) {
  //     let rooms = sdk.getRooms();
  //     expect(rooms.value).to.be.an("array");
  //     expect(rooms.value[0]).to.be.an("object");
  //     expect(rooms.value[0]).to.include({ name: "First room" });
  //     done();
  //   });
  // });
});
