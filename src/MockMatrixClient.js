const rxjs = require("rxjs");
const authData = require("../src/AuthData");

let of = rxjs.of;

let baseUrl = authData.baseUrl;
let accessToken = authData.accessToken;
let userId = authData.userId;

module.exports = class MockMatrixClient {
  createClient(opts) {
    if (
      opts.baseUrl === baseUrl &&
      opts.accessToken === accessToken &&
      opts.userId === userId
    ) {
      return of("PREPARED");
    } else {
      return of("STOPPED");
    }
  }

  getRooms() {
    return of([
      {
        myUserId: "@henrik.johansson:matrix.org",
        roomId: "!UHddZgulGIaYUQlwNG:matrix.org",
        name: "First room",
        tags: {}
      }
    ]);
  }

  getLiveTimeline() {
    return of([{}]);
  }
};
