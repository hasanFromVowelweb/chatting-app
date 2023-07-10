import React, { useState } from 'react'
import '../assets/sidebar.css'
import { Avatar, IconButton, Popper, Box, Button } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import SidebarChat from './SidebarChat';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth0 } from "@auth0/auth0-react";

export default function Sidebar({ setUserName, setRoomID, setChatName }) {
  ///////////////////login authentication////////////////////
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (!isLoading) {
    setUserName(user?.nickname)
  }

  ////////////////////////////////////////////////////////////////////////

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  ////////////////////////////////////////////////

  function handleClickChat(roomId, chatName) {
    console.log('clicked a chat sidebar')
    setRoomID(roomId)
    setChatName(chatName)
  }

  return (
    <div className='sidebar'>
      <div className="sidebar_header">
        <IconButton aria-describedby={id} type="button" onClick={handleClick}>
          <Avatar src={isAuthenticated ? user.picture : ''} />
        </IconButton>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="right">
          <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
            {isAuthenticated ? <>  <h4 style={{ padding: "4px 4px 6px 4px" }}>Hi, {user.nickname}</h4><Button variant="outlined" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Button> </> : <Button variant="outlined" onClick={() => loginWithRedirect()}>Login</Button>}
          </Box>
        </Popper>
        <div className="sidebar_headerRight">
          {/* <IconButton>
            <DonutLargeIcon />
          </IconButton> */}
          <IconButton>
            <GroupsIcon fontSize='medium' />
          </IconButton>
          <IconButton>
            <MessageIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input type="text" placeholder='Enter name or start new chat' />
        </div>
      </div>
      <div className="sidebarChats">
        <SidebarChat
          onClick={()=>handleClickChat('chat1', 'chat 1')}
          groupName={'chat 1'}
          lastmsg={'chat 1 last message'}
        />
        <SidebarChat
          onClick={()=>handleClickChat('chatGroup1', 'Group 1')}
          groupName={'Group 1'}
          lastmsg={'group 1 last message'}
        />
        <SidebarChat
          onClick={()=>handleClickChat('chatGroup2', 'Group 2')}
          groupName={'Group 2'}
          lastmsg={'group 2 last message'}
        />
      </div>
    </div>
  )
}
