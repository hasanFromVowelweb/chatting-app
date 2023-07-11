import React, { useState, useEffect } from 'react'
import '../assets/chat.css'
import { Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import io from 'socket.io-client';
import { renderToString } from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';



export default function Chat({ userName, roomID, chatName }) {

  const form = document.getElementById('send-container')
  const messageInput = document.getElementById('message-input')
  const chatHeaderInfo = document.querySelector('.chat_headerInfo')
  const messageContainer = document.querySelector('.message-container');

  var audio = new Audio('ting.mp3');

  const socket = io('http://localhost:3000');

  const someOnesOnline = (message) => {
    const messageElement = document.createElement('code');
    messageElement.innerText = message && message;
    chatHeaderInfo.append(messageElement)
    setTimeout(() => {
      chatHeaderInfo.removeChild(messageElement)
    }, 3000)
  }

  const someOnesOffline = (message) => {
    const messageElement = document.createElement('code');
    messageElement.innerText = message && message;
    chatHeaderInfo.append(messageElement)
    setTimeout(() => {
      chatHeaderInfo.removeChild(messageElement)
    }, 3000)
  }

  const recievedChat = (message, name, time) => {
    console.log('message :', message)
    console.log('name :', name)
    console.log('time :', time)
    const messageHtmlRecieve = `
    <p class="chat_message">
      <span class="chat_name">${name}</span>
      <span class="chat">${message?.message}</span>
      <span class="chat_timestamp">${time}</span>
    </p>
  `;

    messageContainer.innerHTML += messageHtmlRecieve;
    messageContainer.scrollTop = messageContainer.scrollHeight;
    audio.play();
  }

  const sendChat = (message, name, time) => {

    const messageHtmlSend = `
    <p class="chat_message chat_reciever">
    <span class="chat_name">${name}</span>
    <span class="chat">${message}</span>
    <span class="chat_timestamp">${time}</span>
    <span class="tick">
      ${ReactDOMServer.renderToString(<DoneAllIcon />)}
    </span>
  </p>
`;

    messageContainer.innerHTML += messageHtmlSend;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  useEffect(() => {

    // const name = prompt('Enter your name to join');
    socket.emit('new-user-online', userName);

    socket.on('user-online', name => {
      someOnesOnline(`${name} is online!`)
    })

    socket.on('receive', data => {
      recievedChat(data.message, data.name, data.time)
    })

    socket.on('userLeftRoom', name => {
      console.log('name', name)
      someOnesOffline(`${name.name} is offline!`)
    })

    return () => {
      socket.disconnect();
    };
  }, [socket, userName, someOnesOnline, recievedChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const timestamp = new Date().toUTCString()
    sendChat(message, 'You', timestamp)
    socket.emit('send', { roomID, message });
    messageInput.value = '';
  };


  useEffect(() => {
    roomID && socket.emit('joinRoom', roomID);
    // document.addEventListener('DOMContentLoaded', function () {
    //   // Your code here
    //   messageContainer.innerHTML = ''
    // });
    if (messageContainer){
      messageContainer.innerHTML = ''
    } 

    return () => {

    }
  }, [roomID, messageContainer])





  return (
    <div className='chat'>
      <div className="chat_header">
        <IconButton>
          <Avatar />
        </IconButton>
        <div className="chat_headerInfo">
          <h3>{chatName}</h3>
          <p>Last seen at....</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="message-container chat_body">
        {/* ///////////////////////recieved message/////////////// */}
        {/* <p className=' chat_message'>
          <span className='chat_name'>Randy</span>
          <span className='chat'>Hey, There!</span>
          <span className='chat_timestamp'>
            {new Date().toUTCString()}
          </span>
        </p> */}

        {/* //////////////////////////send message////////////////////////// */}
        {/* <p className='chat_message chat_reciever'>
          <span className='chat_name'>Brock</span>
          <span className='chat'>Hey,</span>
          <span className='chat_timestamp'>
            {new Date().toUTCString()}
          </span>
          <span className='tick'>
            <DoneAllIcon />
          </span>
        </p> */}
      </div>

      <div className="chat_footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <form id='send-container' onSubmit={handleSubmit}>
          <input type="text" id='message-input' placeholder='Type a message' />
          <button id='send-btn' type='submit'> send a message</button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>


    </div>
  )
}
