"use strict";

const sdk = require("matrix-js-sdk");
const authData = require("./AuthData");

let baseUrl = authData.baseUrl;
let accessToken = authData.accessToken;
let userId = authData.userId;

const client = sdk.createClient({
  baseUrl: baseUrl,
  accessToken: accessToken,
  userId: userId
});

let roomList = [];
let viewingRoom = null;
let numMessagesToShow = 20;

client.on("sync", function(state, prevState, data) {
  switch (state) {
    case "CATCHUP":
      console.log(state + ": Connection found, retrying sync");
      break;
    case "ERROR":
      console.log(state + ": Could not connect to server");
      break;
    case "PREPARED":
      console.log(state);
      setRoomList();
      printRoomList();
      printChatLog();
      findMessagesByDate("04 Feb 2019");
      break;
    case "RECONNECTING":
      console.log(state + ": Connection lost");
      break;
    case "STOPPED":
      console.log(state + ": Syncing stopped");
      break;
    case "SYNCING":
      console.log(state);
      break;
  }
});

function setRoomList() {
  roomList = client.getRooms();
  scrollbackRoomEvents();
}

function scrollbackRoomEvents() {
  roomList.forEach(async function(room) {
    await client.scrollback(room);
  });
}

function printRoomList() {
  console.log("\nAvailable rooms:");
  for (let i = 0; i < roomList.length; i++) {
    let events = roomList[i].getLiveTimeline().getEvents();
    let dateString = "---";
    events.forEach(event => {
      if (event) {
        dateString = new Date(Date.now() - event.event.unsigned.age)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
      }
    });

    let myMembership = roomList[i].getMyMembership();
    let roomName = roomList[i].name;
    let roomId = roomList[i].roomId;

    console.log(
      `[${i}] ${roomName}/${roomId} (${
        roomList[i].getJoinedMembers().length
      } members) ${dateString}`
    );
  }
}

// function sendNotice(body, roomId) {
//     let content = {
//         'body': body,
//         'msgtype': 'm.notice'
//     };
//     client.sendEvent(roomId, 'm.room.message', content, '', (err, res) => {
//         if (err) {
//             console.log(err);
//         }
//     });
// }

function findMessagesByDate(date) {
  let events = roomList[0].getLiveTimeline().getEvents();
  let requestDate = new Date(date);
  console.log(`\nMessages sent on ${requestDate.toDateString()}:`);

  events.forEach(event => {
    if (event.getType() === "m.room.message") {
      let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
      messageTimeStamp.setHours(0, 0, 0, 0);

      if (messageTimeStamp.getTime() === requestDate.getTime()) {
        printFormattedMessages(event);
      }
    }
  });
}

function printChatLog() {
  console.log("\nMessages:");
  let events = roomList[0].getLiveTimeline().getEvents();

  events.forEach(event => {
    if (event.getType() === "m.room.message") {
      printFormattedMessages(event);
    }
  });
}

function printFormattedMessages(event) {
  let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
  messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
  let messageTimeStampSplit = messageTimeStamp.toISOString().split(/[T.]+/);

  let sender = event.event.sender.split(/[@:]+/)[1];

  if (event.event.sender === userId) {
    console.log(
      `[${messageTimeStampSplit[0]}, ${
        messageTimeStampSplit[1]
      }] ${sender} >>> ${event.event.content.body}`
    );
  } else {
    console.log(
      `[${messageTimeStampSplit[0]}, ${
        messageTimeStampSplit[1]
      }] ${sender} <<< ${event.event.content.body}`
    );
  }
}

client.startClient(numMessagesToShow);

setTimeout(function() {
  client.stopClient();
  process.exit();
}, 5000);
