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
});
