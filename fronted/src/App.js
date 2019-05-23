import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import moment from 'moment'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts'

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
    socket.on('new-message', (messageNew) => {
      temp.push(messageNew)
      this.setState({ message :  temp})
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
      {/* <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {data.tweet}
              </div>
            )
          }
        </div> */}
      </div>
    )
  }
}

export default App