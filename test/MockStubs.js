const rxjs = require("rxjs");
const authData = require("../src/AuthData");

let of = rxjs.of;

let baseUrl = authData.baseUrl;
let accessToken = authData.accessToken;
let userId = authData.userId;

class MockMatrixClient {
  constructor() {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.userId = userId;
  }
  // createClient(opts) {
  //   if (
  //     opts.baseUrl === this.baseUrl &&
  //     opts.accessToken === this.accessToken &&
  //     opts.userId === this.userId
  //   ) {
  //     return "PREPARED";
  //   } else {
  //     return "ERROR";
  //   }
  // }

  getBaseUrl() {
    return this.baseUrl;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getUserId() {
    return this.userId;
  }

  getRooms() {
    return [
      {
        myUserId: "@henrik.johansson:matrix.org",
        roomId: "!UHddZgulGIaYUQlwNG:matrix.org",
        name: "First room",
        tags: {}
      }
    ];
  }

  getLiveTimeline() {
    return of([{}]);
  }
}

module.exports = {
  MockMatrixClient: MockMatrixClient
};
