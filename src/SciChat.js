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

let rooms = [];
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
      setRooms();
      printRooms();
      printChatLog();
      findMessagesByDate("04 Feb 2019");
      findMessagesByDateRange("04 Feb 2019", "05 Feb 2019");
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

function setRooms() {
  rooms = client.getRooms();
  scrollbackRoomEvents();
  return rooms;
}

function scrollbackRoomEvents() {
  rooms.forEach(async function(room) {
    await client.scrollback(room);
  });
}

function printRooms() {
  console.log("\nAvailable rooms:");

  let listIndex = 0;

  rooms.forEach(room => {
    let events = room.getLiveTimeline().getEvents();
    let dateString = "---";

    events.forEach(event => {
      if (event) {
        dateString = new Date(Date.now() - event.event.unsigned.age)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");
      }
    });

    let myMembership = room.getMyMembership();
    let roomName = room.name;
    let roomId = room.roomId;

    console.log(
      `[${listIndex}] ${roomName}/${roomId} (${
        room.getJoinedMembers().length
      } members) ${dateString}`
    );
    listIndex++;
  });
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
  let events = rooms[0].getLiveTimeline().getEvents();
  let requestDate = new Date(date);
  console.log(`\nMessages sent on ${requestDate.toDateString()}:`);

  events.forEach(event => {
    let messageTimeStamp = setTimeStampToStartOfDay(event);

    if (messageTimeStamp.getTime() === requestDate.getTime()) {
      printFormattedMessage(event);
    }
  });
}

function findMessagesByDateRange(startDate, endDate) {
  let events = rooms[0].getLiveTimeline().getEvents();
  let requestStartDate = new Date(startDate);
  let requestEndDate = new Date(endDate);
  console.log(
    `\nMessages sent between ${requestStartDate.toDateString()} and ${requestEndDate.toDateString()}:`
  );

  events.forEach(event => {
    let messageTimeStamp = setTimeStampToStartOfDay(event);

    if (
      messageTimeStamp.getTime() >= requestStartDate.getTime() &&
      messageTimeStamp.getTime() <= requestEndDate.getTime()
    ) {
      printFormattedMessage(event);
    }
  });
}

function setTimeStampToStartOfDay(event) {
  let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
  messageTimeStamp.setHours(0, 0, 0, 0);
  return messageTimeStamp;
}

function printChatLog() {
  console.log("\nMessages:");
  let events = rooms[0].getLiveTimeline().getEvents();

  events.forEach(event => {
    printFormattedMessage(event);
  });
}

function printFormattedMessage(event) {
  if (event.getType() === "m.room.message") {
    let [messageDate, messageTime] = formatTimeStamp(event);
    let sender = event.event.sender.split(/[@:]+/)[1];

    if (event.event.sender === userId) {
      console.log(
        `[${messageDate}, ${messageTime}] ${sender} >>> ${
          event.event.content.body
        }`
      );
    } else {
      console.log(
        `[${messageDate}, ${messageTime}] ${sender} <<< ${
          event.event.content.body
        }`
      );
    }
  }
}

function formatTimeStamp(event) {
  let messageTimeStamp = new Date(Date.now() - event.event.unsigned.age);
  messageTimeStamp.setUTCHours(messageTimeStamp.getUTCHours() + 1);
  return messageTimeStamp.toISOString().split(/[T.]+/);
}

client.startClient(numMessagesToShow);

setTimeout(() => {
  client.stopClient();
  process.exit();
}, 5000);

module.exports = {
  formatTimeStamp: formatTimeStamp,
  setRooms: setRooms
}