'use strict';

const boards = require("../data/data.js")
const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  app.route('/api/threads/:board')
    .get((req, res) => {
      const boardName = req.params.board
      res.json(boards[boardName].messages)
    })
    .post((req, res) => {
      const boardName = req.params.board
      console.log("trying to create a new board with a thread")
      console.log(req.body, req.params)

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

  app.route('/api/replies/:board')
    .get((req, res) => {

      const boardName = req.params.board
      const arrayToSearchThrough = boards[boardName].messages
      const idToSearch = req.query.thread_id
      let foundMessage = findMessage(arrayToSearchThrough, idToSearch)
      res.json(foundMessage)
    })
    .post((req, res) => {
      console.log("trying to create a reply to an existing message of an existing board")
      console.log(req.body, req.params)

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




};

function findMessage(arrayToSearchThrough, idToSearch) {
  let foundMessage = null
  for (let i = 0; i < arrayToSearchThrough.length; i++) {
    if (arrayToSearchThrough[i]._id === idToSearch) {
      foundMessage = arrayToSearchThrough[i];
      break;
    }
  }
  if (foundMessage) {
    // console.log(foundMessage);
  } else {
    console.log('Object not found');
  }
  return foundMessage
}