'use strict';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const sdk = require('../src/MockMatrixClient');
const authData = require('../src/AuthData');
// const app = require('../src/SciChat');

describe('Simple test of function createClient using mock API', function () {
    describe('#createClient()', function () {
        it('valid authentication should return the state `PREPARED`', function (done) {
            let state = sdk.prototype.createClient({
                baseUrl: authData.baseUrl,
                accessToken: authData.accessToken,
                userId: authData.userId
            });
            expect(state.value).to.equal('PREPARED');
            done();
        });

        it('invalid authentication should return the state `STOPPED`', function (done) {
            let state = sdk.prototype.createClient({
                baseUrl: authData.baseUrl,
                accessToken: "123",
                userId: authData.userId
            });
            expect(state.value).to.equal('STOPPED');
            done();
        });
    });

    describe('#getRooms()', function () {
        it('should return an array of objects containing userId, roomId and room name', function (done) {
            let rooms = sdk.prototype.getRooms();
            expect(rooms.value).to.be.an('array');
            expect(rooms.value[0]).to.be.an('object');
            expect(rooms.value[0]).to.include({name: 'First room'});
            done();
        });
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

