import React, { Component } from 'react';
import UserController from './UserController.jsx';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {current:[]};
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
    }
    render(){
      return(
        <div className='app'>
            <div class='sidenav'>
              <p><a href='#'>home</a></p>
              <p><a href='#'  onClick={this.state.rescan}>re-scan</a></p>
              <p>current users: {this.state.current.length}</p>
              <p>last scanned: <br/> {this.state.time}</p>
            </div>
            <UserController handleClick={this.state.nmapScan} curUsers={this.state.current}/>
        </div>
      )
    }
}

export default App;
