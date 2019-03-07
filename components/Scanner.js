import React, { Component } from 'react';
import UserController from './UserController.jsx';

class Scanner extends React.Component{
    constructor(props){
        super(props);
        this.state = {current:[]};
        this.state.
        fetch('/api')
            .then(response=>response.json())
            .then(data=>{
              const date = new Date(parseInt(data[0].timestamp));
              this.setState({current:data, time: date.toString().toLowerCase()})
            })
    }
    render(){
        return(
            <div className='app'>
                <div>
                  <h1 className='title'> last scanned: {this.state.time}</h1>
                  <button className='scanButton'>re-scan</button>
                  <UserController curUsers={this.state.current}/>
                </div>
            </div>
        )
    }
}

export default Scanner;
