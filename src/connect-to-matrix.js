'use strict';

const sdk = require('matrix-js-sdk');
const authData = require('./AuthData');

let baseUrl = 'https://matrix.org';
let accessToken = authData.accessToken;
let userId = authData.userId;

const client = sdk.createClient({
    baseUrl: baseUrl,
    accessToken: accessToken,
    userId: userId
});

client.startClient({
    initialSyncLimit: 10
});

client.once('sync', function (state, prevState, res) {
    if (state === 'PREPARED') {
        console.log('prepared');

        // TODO find a way to list the entire chat log instead of just most recent

        // let rooms = client.getRooms();
        // let thisThing = rooms[0].getLiveTimeline();
        // thisThing.forEach(matrixEvent => {
        //     console.log(matrixEvent.event.content.body);
        // });
        // console.log(thisThing);
        // console.log(rooms[0].getTimelineSets());
        // let timelineWindow = sdk.TimelineWindow(client, rooms[0].getTimelineSets());
        // console.log(timelineWindow.canPaginate(sdk.EventTimeline.BACKWARDS));

    } else {
        console.log(state);
        process.exit(1);
    }
});

    // let rooms = client.getRooms();
    // client.paginateEventTimeline(rooms[0].timeline, {
    //     backwards: true,
    //     limit: 1000
    // });


// showAllMessages();

findByDate('04 Feb 2019');

function showAllMessages() {
    client.on('Room.timeline', function (event, room, toStartOfTimeline) {
        if (event.getType() !== 'm.room.message') {
            return;
        }

        // let roomId = event.event.room_id;
        // let botResponse = 'Measurements are now ready.';
        // if (event.getRoomId() === roomId && event.getContent().body[0] === '!') {
        //     sendNotice(botResponse, roomId);
        // }


        // console.log(event.event);
        // console.log(room.name);

        printChatLog(room);
    });
}

function sendNotice(body, roomId) {
    let content = {
        'body': body,
        'msgtype': 'm.notice'
    };
    client.sendEvent(roomId, 'm.room.message', content, '', (err, res) => {
        if (err) {
            console.log(err);
        }
    });
}

function findByDate(date) {
    client.on('Room.timeline', function (event, room, toStartOfTimeline) {
        if (event.getType() !== 'm.room.message') {
            return;
        }

        let requestDate = new Date(date);
        let messageAge = new Date(Date.now() - event.event.unsigned.age);
        messageAge.setHours(0, 0, 0, 0);

        if (messageAge.getTime() === requestDate.getTime()) {
            printChatLog(room);
        }
    });
}

function printChatLog(room) {
    let events = room.getLiveTimeline().getEvents();
    events.forEach(event => {
        let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
        messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
        let messageTimeStampSplit = messageTimeStamp.toISOString().split(/[T.]+/);
        let sender = event.event.sender.split(/[@:]+/)[1];

        if (event.event.sender === userId) {
            console.log(`[${messageTimeStampSplit[0]}, ${messageTimeStampSplit[1]}] ${sender} >>> ${event.event.content.body}`);
        } else {
            console.log(`[${messageTimeStampSplit[0]}, ${messageTimeStampSplit[1]}] ${sender} <<< ${event.event.content.body}`);
        }
    });
}