const MatrixClient = require('matrix-bot-sdk').MatrixClient;
const AutojoinRoomsMixin = require('matrix-bot-sdk').AutojoinRoomsMixin;
let accessToken = 'MDAxOGxvY2F0aW9uIG1hdHJpeC5vcmcKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDJmY2lkIHVzZXJfaWQgPSBAaGVucmlrLmpvaGFuc3NvbjptYXRyaXgub3JnCjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gREo4cjt5dXUjMTQzNyYrTQowMDJmc2lnbmF0dXJlICgnZQkM81cW2-8XTVjCuWE4bzdzSZSJU5DUWBDResBTCg';

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