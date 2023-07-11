import { useState } from 'react'
import Sidebar from './component/Sidebar'
import Chat from './component/Chat'
import './assets/app.css'


function App() {
  const [userName, setUserName]  = useState()
  const [roomID, setRoomID] = useState()
  const [chatName, setChatName] = useState() 

  return (
    <div className='app'>
      <div className="app_body">
        <Sidebar setUserName={setUserName}  setRoomID={setRoomID} setChatName={setChatName}/>
       <Chat userName={userName} roomID={roomID}  chatName={chatName}/>
      </div>
    </div>
  )
}

export default App
