const rxjs = require('rxjs');
const authData = require('AuthData');

let of = rxjs.of;

module.exports = class MockMatrixClient {

    opts = {
        baseUrl: authData.baseUrl,
        accessToken: authData.accessToken,
        userId: authData.userId
    };

    createClient(opts) {
        if (opts.baseUrl === this.opts.baseUrl
            && opts.accessToken === this.opts.accessToken
            && opts.userId === this.opts.userId) {
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