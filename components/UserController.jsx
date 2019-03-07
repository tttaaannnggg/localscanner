import React, {Component} from 'react';
import UserDisplay from './UserDisplay.jsx';

const UserController = (props)=>{
  const selectedUsers = [];
  props.curUsers.forEach((item,i)=>{
    selectedUsers.push(
      <UserDisplay handleClick = {props.handleClick}  user={item} i={i}/>
    )
  })
  return (
    <div className='usercontainer'>
      {selectedUsers}
    </div>
  )
}

export default UserController
