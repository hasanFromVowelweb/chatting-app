import React from 'react'
import '../assets/sidebarChat.css'
import { Avatar } from '@mui/material';


export default function SidebarChat({ onClick, groupName, lastmsg }) {
    return (
        <div className='sidebarChat' onClick={onClick}>
            <Avatar />
            <div className="sidebarChat_info">
                <h2>{groupName}</h2>
                <p>{lastmsg}</p>
            </div>
        </div>
    )
}
