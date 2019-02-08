let sdk = require('matrix-js-sdk');
let authData = require('./AuthData');

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
        console.log("prepared");
    } else {
        console.log(state);
        process.exit(1);
    }
});

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