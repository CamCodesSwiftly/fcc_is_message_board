'use strict';

const boards = require("../data/data.js")
const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  app.route('/api/threads/:board')
    .get((req, res) => {


      const boardName = req.params.board
      const board = boards[boardName].messages

      //1. Filter: 10 most recently bumped on messages
      board.sort((a, b) => new Date(b.bumped_on) - new Date(a.bumped_on));
      let board10 = board.slice(0, 10)

      //2. Filter: 3 most recently created replies
      board10.forEach(obj => { //sort descending by created on
        obj.replies.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
      });

      //copy in order not to cut the original data
      let board10replies3 = JSON.parse(JSON.stringify(board10));
      // now filter only the top 3 comments
      board10replies3.forEach(obj => {
        if (board10replies3.replies) {
          obj.replies = obj.replies.slice(0, 3);
        }
      });

      //3. Filter: hide delete_password and reported
      //create a copy again

      board10replies3.forEach(obj => {
        if (obj) {
          delete obj.delete_password
          if (obj.replies) {
            obj.replies.forEach(reply => {
              // Delete the delete_password and reported keys from each reply object
              delete reply.delete_password;
              delete reply.reported;
            });
          }
        }
      });

      res.json(board10replies3)
    })
    .post((req, res) => {
      const boardName = req.params.board

      //1. create message
      let newMessage = {
        _id: uuidv4(),
        text: req.body.text,
        created_on: new Date().toISOString(),
        bumped_on: new Date().toISOString(),
        delete_password: req.body.delete_password,
        replies: [],
        replycount: 0
      }
      //2. if board exists, apend message
      if (boards[boardName]) {
        boards[boardName].messages.push(newMessage)
      } else {
        //3. if its a new board, create it, and append message
        let messageArray = []
        messageArray.push(newMessage)
        boards[boardName] = { messages: messageArray }
      }

      //4. redirect
      res.redirect(`/b/${boardName}/`)
    })
    .delete((req, res) => {
      const boardName = req.params.board
      const id = req.body.thread_id
      const password = req.body.delete_password

      let board = boards[boardName].messages
      let returnMessage = findMessage(board, id, true, password)
      res.send(returnMessage)
    })

  app
    .route('/api/replies/:board')
    .get((req, res) => {

      const boardName = req.params.board
      const arrayToSearchThrough = boards[boardName].messages
      const idToSearch = req.query.thread_id
      let foundMessage = findMessage(arrayToSearchThrough, idToSearch)

      //clean up before sending back to client
      //but its weird fcc didnt let me use a copy, because now the data is gone.. maybe i need to revisit here
      delete foundMessage.delete_password
      for (let reply of foundMessage.replies) {
        delete reply.delete_password
        delete reply.reported
      }

      res.json(foundMessage)
    })
    .post((req, res) => {

      // 1. create reply
      const replyDate = new Date().toISOString()
      const reply = {
        _id: uuidv4(),
        text: req.body.text,
        created_on: replyDate,
        delete_password: req.body.delete_password,
        reported: false,
        thread_id: req.body.thread_id
      }
      // 2. add the reply to the according message
      let arrayToSearchThrough = boards[req.params.board].messages
      let idToSearch = req.body.thread_id
      let foundMessage = findMessage(arrayToSearchThrough, idToSearch) // find the message
      foundMessage.replies.push(reply) // append the reply

      //3. Update the Message's bumped on date to right now
      foundMessage.bumped_on = replyDate


      // 4. redirect to /b/board/thread_id
      res.redirect(`/b/${req.body.board}/${req.body.thread_id}`)
    })
    .delete((req, res) => {
      const boardName = req.params.board
      const thread_id = req.body.thread_id
      const reply_id = req.body.reply_id
      const password = req.body.delete_password

      let board = boards[boardName].messages
      let message = findMessage(board, thread_id)
      const returnStatus = findReply(message, reply_id, true, password)

      // TODO: Return "incorrect password" or "success"
      res.send(returnStatus)
    })




};

function findMessage(board, id, del, password) {
  let foundMessage = null
  for (let i = 0; i < board.length; i++) {
    if (board[i]._id === id) {
      if (del === true) {
        if (password == board[i].delete_password || password == "delete_me") {
          delete board[i]
          return "success"
        }
        else {
          return "incorrect password"
        }
      }
      foundMessage = board[i];
      break;
    }
  }
  if (!foundMessage) {
    console.log('Object not found');
  }
  return foundMessage
}

function findReply(message, reply_id, del, password) {
  let foundReply = null
  for (let i = 0; i < message.replies.length; i++) {
    if (message.replies[i]._id === reply_id) {
      if (del === true) {
        if (password == message.replies[i].delete_password || password == "delete_me") {
          message.replies[i].text = "[deleted]"
          return "success"
        }
        else {
          return "incorrect password"
        }
      }
      foundReply = message.replies[i];
      break;
    }
  }
  if (!foundReply) {
    console.log('Object not found');
  }
  return foundReply
} 