'use strict';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const sdk = require('matrix-js-sdk');
const authData = require('../src/AuthData');
const app = require('../src/SciChat');

describe('smoke test', function () {
    it('checks equality', function () {
        expect(true).to.be.true;
    });
});

// describe('Data fetching test', function () {
//     before(function (done) {
//         let baseUrl = 'https://matrix.org';
//         let accessToken = authData.accessToken;
//         let userId = authData.userId;
//
//         const client = sdk.createClient({
//             baseUrl: baseUrl,
//             accessToken: accessToken,
//             userId: userId
//         });
//
//         client.startClient({
//             initialSyncLimit: 10
//         });
//
//         client.once('sync', function (state, prevState, res) {
//             if (state === 'PREPARED') {
//                 console.log('prepared');
//             } else {
//                 console.log(state);
//                 process.exit(1);
//             }
//         });
//     });
//
//     describe('#findByDate()', function () {
//         it('should return all messages sent on 4 Feb, 2019', async function () {
//             const event = await app.findByDate('04 Feb 2019');
//             let messageAge = new Date(Date.now() - event.event.unsigned.age);
//             messageAge.setHours(0, 0, 0, 0);
//             messageAge.should.equal(new Date('04 Feb 2019'));
//         });
//     });
// });

