const MatrixClient = require('matrix-bot-sdk').MatrixClient;
const AutojoinRoomsMixin = require('matrix-bot-sdk').AutojoinRoomsMixin;
const authData = require('AuthData');
let accessToken = authData.accessToken;

const client = new MatrixClient('https://matrix.org', accessToken);
AutojoinRoomsMixin.setupOnClient(client);
client.start().then(() => console.log('Client started!'));

const Eliza = require('eliza-as-promised');
let elizas = {};
client.on('room.join', (roomId) => {
    elizas[roomId] = {
        eliza: new Eliza(),
        last: (new Date()).getTime()
    }
    client.sendMessage(roomId, {
        'msgtype': 'm.notice',
        'body': elizas[roomId].eliza.getInitial()
    });
});

client.on('room.message', async (roomId, event) => {
    if (event['sender'] === await client.getUserId()) return;
    if (!event.content || !event.content.body) return;

    elizas[roomId].eliza.getResponse(event.content.body)
        .then((response) => {
            let responseText = '';
            if (response.reply) {
                responseText = response.reply;
            }
            if (response.final) {
                responseText = response.final;
            }

            client.sendMessage(roomId, {
                'msgtype': 'm.notice',
                'body': responseText,
                'responds': {
                    'sender': event.sender,
                    'message': event.content.body
                }
            }).then((eventId) => {
                if (response.final) {
                    client.leaveRoom(roomId);
                }
            });
        });
});