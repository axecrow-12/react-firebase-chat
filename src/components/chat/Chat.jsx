import { useState, useRef, useEffect } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { useChatStore } from "../../lib/chatStore"

const Chat = () => {
const [open,setOpen] = useState(false)
const [text,setText] = useState("")
const endRef = useRef(null)
const { chatId, user } = useChatStore()

useEffect(() => {
  endRef.current?.scrollIntoView({behavior:"smooth"})
},[chatId]);


const handleEmoji = (e) =>{
  setText((prev)=> prev + e.emoji);
  setOpen(false)
};

  if (!chatId) {
    return (
      <div className='chat empty'>
        <p>Select a chat, or press + to find someone to talk to.</p>
      </div>
    )
  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user.username}</span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <p className="noMessages">No messages yet. Say hello to {user.username}!</p>
       <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input 
          type="text" 
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
         />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={()=>setOpen(prev=>!prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  )
}

export default Chat