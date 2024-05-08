const { v4: uuidv4 } = require('uuid');

const time_now = new Date();

let boards = {
  testboard: {
    messages: []
  }
};

// Function to generate 4 replies for a message
function generateReplies(messageId) {
  const replies = [];
  for (let i = 0; i < 4; i++) {
    const reply = {
      _id: uuidv4(),
      text: `Reply ${i + 1} to message ${messageId}`,
      created_on: new Date(time_now.getTime() + i * 1000).toISOString(), // Varying timestamps
      delete_password: "123",
      reported: false,
      thread_id: messageId
    };
    replies.push(reply);
  }
  return replies;
}

// Generate 12 messages
for (let i = 0; i < 11; i++) { // Reduced to 11 to make space for the extra message
  const messageId = uuidv4();
  const message = {
    _id: messageId,
    text: `Message ${i + 1}`,
    created_on: new Date(time_now.getTime() + i * 1000).toISOString(), // Varying timestamps
    bumped_on: new Date(time_now.getTime() + i * 1000).toISOString(), // Varying timestamps
    delete_password: "123",
    replies: generateReplies(messageId)
  };
  boards.testboard.messages.push(message);
}

// Add the extra message with id "9987654321"
const extraMessage = {
  _id: "987654321",
  text: "Extra Message",
  created_on: new Date(time_now.getTime() + 11 * 1000).toISOString(), // Varying timestamps
  bumped_on: new Date(time_now.getTime() + 11 * 1000).toISOString(), // Varying timestamps
  delete_password: "123",
  replies: generateReplies("987654321")
};
const extraMessage2 = {
  _id: "9876543210",
  text: "Extra Message2",
  created_on: new Date(time_now.getTime() + 21 * 1000).toISOString(), // Varying timestamps
  bumped_on: new Date(time_now.getTime() + 21 * 1000).toISOString(), // Varying timestamps
  delete_password: "123",
  replies: generateReplies("9876543210")
};
const extraMessage3 = {
  _id: "111111",
  text: "Extra Message3",
  created_on: new Date(time_now.getTime() + 33 * 1000).toISOString(), // Varying timestamps
  bumped_on: new Date(time_now.getTime() + 33 * 1000).toISOString(), // Varying timestamps
  delete_password: "123",
  replies: generateReplies("111111")
};

const testReply = {
  _id: "0000",
  text: `Test Reply That has to be deleted`,
  created_on: new Date(time_now.getTime()).toISOString(), // Varying timestamps
  delete_password: "123",
  reported: false,
  thread_id: "987654321"
}
const testReply2 = {
  _id: "333",
  text: `mocha test reply That has to be deleted`,
  created_on: new Date(time_now.getTime()).toISOString(), // Varying timestamps
  delete_password: "123",
  reported: false,
  thread_id: "111111"
}

extraMessage.replies.push(testReply);
extraMessage3.replies.push(testReply2);

boards.testboard.messages.push(extraMessage);
boards.testboard.messages.push(extraMessage2);
boards.testboard.messages.push(extraMessage3);


module.exports = boards;
