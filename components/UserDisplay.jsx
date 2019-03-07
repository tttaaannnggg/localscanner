import React from 'react';

const userDisplay = (props)=>{
  const user = props.user;
  const links = [];
  let openPorts = null;
  if(props.user.ports){
    openPorts = props.user.ports.openPorts;
  }
  if(openPorts && Array.isArray(openPorts)){
    console.log('building links');
    for (let i = 0; i < openPorts.length; i++){
      const port = openPorts[i].port;
      links.push(<p><a href={`http://${props.user.ip}:${port}`}>{port}</a></p>)
    }
  } else{
    console.log('no open ports');
  }
  return (
    <div className='user' >
      <p className='i'> {props.i} </p>
      <p> {props.user.ip} </p>
      <p> {props.user.mac} </p>
        <span className="macstuff">ports: {links.length}</span>
        <div className="portmenuitems">
          <p onClick={()=>{props.handleClick(props.i)}}><a href="#">scan ports </a></p>
          <p> {links} </p>
      </div>
    </div>
  )

}

export default userDisplay;
