import React, { Component } from 'react';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {current:[]};
    }
    render(){
        fetch('/api')
            .then(response=>response.json())
            .then(data=>{
                this.setState({current:data})
            })
        const currentUsers = [];
            
        this.state.current.forEach((item)=>{
            currentUsers.push(
                <div>
                    <p>mac: {item.mac}</p>
                    <p>timestamp: {new Date(parseInt(item.timestamp)).toString()}</p>
                </div>
            )
        })
        console.log(currentUsers)
        return(
            <div>
                <h1> hello world </h1>
                {currentUsers}
                <button onClick='loadCurrent()'>load</button>
            </div>
        )
    }
}

export default App;
