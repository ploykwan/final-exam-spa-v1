import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
import firebase from 'firebase'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts'

const firebaseConfig = {
  apiKey: "AIzaSyD3_7ErQe2JZOWxJwuu2JE8J2gm8-Pj0PU",
  authDomain: "final-exam-spa-241508.firebaseapp.com",
  databaseURL: "https://final-exam-spa-241508.firebaseio.com",
  projectId: "final-exam-spa-241508",
  storageBucket: "final-exam-spa-241508.appspot.com",
  messagingSenderId: "21307193607",
  appId: "1:21307193607:web:63ce378a73d1162b"
};

firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      endpoint: "35.238.132.42" // เชื่อมต่อไปยัง url ของ realtime server
    }
  }

  componentDidMount = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    firebase.database().ref("/database").once("value", (snap,error) => {
        console.log(error)
        console.log(Object.values(snap.val()))
        // this.setState({ message: Object.values(snap.val()) })
        let temp = Object.values(snap.val())
        let tempArray = []
        console.log(snap.val());
        
        temp.forEach(m => {
          if (m.retweeted_status) {
            let text = 'RT '
            if (m.retweeted_status.extentedTweet) {
              tempArray.push({ text: text + m.retweeted_status.extended_tweet.full_text, timestamp: m.timestamp_ms })
            } else {
              tempArray.push({ text: text + m.retweeted_status.text, timestamp: m.timestamp_ms })
            }
          } else {
            tempArray.push({ text: m.text, timestamp: m.timestamp_ms })
          }
        })
        this.setState({message : [...this.state.message, ...tempArray]})
      })
    socket.on('new-message', (messageNew) => {
      temp.push(messageNew)
      this.setState({ message :  [...this.state.message, ...temp]})
    })
  }

  render() {  
    const { message } = this.state
    const data = []
    message.forEach(m => {
      let ms = m.timestamp /1000
      let time = moment.unix(ms).format('hh:mm')
      const findTime = data.find(d => d.time === time)
        if (findTime) {
          findTime.count++

        } else {
          data.push({ time , count: 1 })
        }
    })
    
    return (
      <div>
      <div>
        <LineChart
        width= {1000}
        height={500}
        data={data}
        margin={{
          top: 100,
          left: 100
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#000000"
          activeDot={{ r: 8 }}
        />
      </LineChart>
      </div>
      </div>
    )
  }
}

export default App