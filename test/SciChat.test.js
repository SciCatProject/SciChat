"use strict";

const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon").createSandbox();
const request = require("supertest");

const sdk = require("matrix-js-sdk");
const MockStubs = require("./MockStubs");
const authData = require("../src/AuthData");
const SciChat = require("../src/SciChat");

let mockClient = new MockStubs.MockMatrixClient();

before(function() {
  let opts = {
    baseUrl: authData.baseUrl,
    accessToken: authData.accessToken,
    userId: authData.userId
  };

  sinon.stub(sdk, "createClient").callsFake(function(opts) {
    if (
      opts.baseUrl === mockClient.getBaseUrl() &&
      opts.accessToken === mockClient.getAccessToken() &&
      opts.userId === mockClient.getUserId()
    ) {
      return "PREPARED";
    } else {
      return "ERROR";
    }
  });
});

describe("Simple test of function createClient using mock API", function() {
  describe("#createClient()", function() {
    it("valid authentication should return the state `PREPARED`", function(done) {
      let state = sdk.createClient({
        baseUrl: authData.baseUrl,
        accessToken: authData.accessToken,
        userId: authData.userId
      });
      expect(state).to.equal("PREPARED");
      done();
    });

    it("invalid authentication should return the state `ERROR`", function(done) {
      let state = sdk.createClient({
        baseUrl: authData.baseUrl,
        accessToken: "123",
        userId: authData.userId
      });
      expect(state).to.equal("ERROR");
      done();
    });
  });

  describe("#setRooms()", function() {
    it("should fetch all available rooms and place them in the array `rooms`", function(done) {
      sinon.spy(SciChat, "setRooms");
      SciChat.setRooms();
      assert(SciChat.setRooms.returned([]));
      done();
    });
  });

  describe("#formatTimeStamp()", function() {
    it("should return an array of format [`yyyy-MM-dd`, `hh:mm:ss`, `ms`]", function(done) {
      let event = {
        event: {
          unsigned: {
            age: 1234567
          }
        }
      };
      sinon.spy(SciChat, "formatTimeStamp");
      SciChat.formatTimeStamp(event);
      assert(SciChat.formatTimeStamp.calledWith(event));
      expect(SciChat.formatTimeStamp.returnValues[0])
        .to.be.an("array")
        .of.length(3);
      expect(SciChat.formatTimeStamp.returnValues[0][0]).to.match(
        /\d{4}-\d{2}-\d{2}/
      );
      done();
    });
  });

  describe.skip("#getRooms()", function() {
    it("should return an array of objects containing userId, roomId and room name", function(done) {
      let rooms = sdk.getRooms();
      expect(rooms.value).to.be.an("array");
      expect(rooms.value[0]).to.be.an("object");
      expect(rooms.value[0]).to.include({ name: "First room" });
      done();
    });
  });
});

after(function() {
  sinon.restore();
});
