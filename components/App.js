import React, { Component } from 'react';
import UserController from './UserController.jsx';
import HistViz from './Visualizer.jsx';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {current:[], userHis: []};
        this.state.getHistory = function(){
          console.log('getting connection history past 12h');
          fetch('/history')
            .then(data=>{return data.json()})
            .then((result)=>{
              this.setState({userHis: result})
            })
        }.bind(this);
        this.state.nmapScan = function(i){
          console.log('scanning ports and OS', i);
          fetch('/nmapscan', {
            method: "POST",
            mode: "cors",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.current[i])
          })
          .then((res)=>res.json())
          .then(data=>{
            const prevArr = [...this.state.current];
            console.log('got data from fetch', data[0]);
            prevArr[i].ports = data[0];
            this.setState({current: prevArr})
          })
        }.bind(this);
        this.state.rescan= function(){
        console.log('fetching new data');
          fetch('/newscan')
            .then(response=>response.json())
            .then(data=>{
              const date = new Date(parseInt(data[0].timestamp));
              this.setState({current:data, time: date.toString()});
              data.forEach((item,i)=>{
                this.state.nmapScan(i);
              })
            })
        }
        this.state.rescan = this.state.rescan.bind(this);
        fetch('/api')
            .then(response=>response.json())
            .then(data=>{
              const date = new Date(parseInt(data[0].timestamp));
              this.setState({current:data, time: date.toString()})
            })
        this.state.getHistory();
    }
    render(){
    /*
      const times = new Set();
      const activity = {};
      console.log('this.state.userHis', this.state.userHis);
      for (let i = 0 ; i < this.state.userHis.length; i++){
        console.log(this.state.userHis[i]);
        const timestamp = this.state.userHis[i].timestamp;
        if (!activity[timestamp]){
          activity[timestamp] = 0;
        }
        activity[timestamp]++;
        times.add(this.state.userHis[i].timestamp);
      }
      */
      return(
        <div className='app'>
            <div class='sidenav'>
              <p><a href='#'>home</a></p>
              <p><a href='#'  onClick={this.state.rescan}>re-scan</a></p>
              <p>current users: {this.state.current.length}</p>
              <p>last scanned: <br/> {this.state.time}</p>
            </div>
            <h1> current users</h1>
            <UserController handleClick={this.state.nmapScan} curUsers={this.state.current}/>
        </div>
      )
    }
}

export default App;
