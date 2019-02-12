const rxjs = require('rxjs');
const authData = require('AuthData');

let of = rxjs.of;

module.exports = class MockMatrixClient {

    constructor() {
        this.baseUrl = authData.baseUrl;
        this.accessToken = authData.accessToken;
        this.userId = authData.userId;
    }

    createClient(opts) {
        if (opts.baseUrl === this.baseUrl
            && opts.accessToken === this.accessToken
            && opts.userId === this.userId) {
            return of('PREPARED');
        } else {
            return of('STOPPED');
        }
    }

    getRooms() {
        return of([{
            myUserId: '@henrik.johansson:matrix.org',
            roomId: '!UHddZgulGIaYUQlwNG:matrix.org',
            name: 'First room',
            tags: {}
        }]);
    }

    getLiveTimeline() {
        return of([{}])
    }
}