// data.js
const { v4: uuidv4 } = require('uuid');

const time_now = new Date();

let boards = {
  testboard: {
    messages: [{
      _id: "987654321",
      text: "first test message",
      created_on: time_now.toISOString(),
      bumped_on: time_now.toISOString(),
      delete_password: "123",
      replies: [{
        _id: uuidv4(),
        text: "comment a on first message: you are so awesome bro",
        created_on: time_now.toISOString(),
        delete_password: "123",
        reported: false,
        thread_id: "987654321"
      }, {
        _id: uuidv4(),
        text: "i wish you the best sir",
        created_on: time_now.toISOString(),
        delete_password: "123",
        reported: false,
        thread_id: "987654321"
      }]
    }, {
      _id: "12479812347809123",
      text: "second message",
      created_on: time_now.toISOString(),
      bumped_on: time_now.toISOString(),
      delete_password: "123",
      replies: [{
        _id: uuidv4(),
        text: "love going out to my man",
        created_on: time_now.toISOString(),
        delete_password: "123",
        reported: false,
        thread_id: "12479812347809123"
      }, {
        _id: uuidv4(),
        text: "on your way to health, wealth, happiness and love",
        created_on: time_now.toISOString(),
        delete_password: "123",
        reported: false,
        thread_id: "12479812347809123"
      }]
    }]
  }
};

module.exports = boards;
