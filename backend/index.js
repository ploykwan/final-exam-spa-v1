const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')

var firebase = require("firebase-admin");
var serviceAccount = require("./final-exam-spa-241508-firebase-adminsdk-dqft6-518ccef4a1.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://final-exam-spa-241508.firebaseio.com"
  });

const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

const port = '4000'

const app = server.listen(port, () => {
  console.log('Server is listening at ' + port)
})

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')

  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const stream = client.stream('statuses/filter', { track: '#tradewar' })
stream.on('data', function (event) {
  if (event != null){
    let db = firebase.database();
    let databaseRef = db.ref("database");
    let eventRef = databaseRef.child(event.id)
    eventRef.set(event)
    //   console.log(event.text)
    io.sockets.emit('new-message', {tweet: event.text, timestamp: event.timestamp_ms})
  }
})
