import { useEffect, useState } from "react"
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useChatStore } from "../../../lib/chatStore"
import { useUserStore } from "../../../lib/userStore"
import AddUser from "./addUser/AddUser"
import "./chatlist.css"

const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([])
  const [filter, setFilter] = useState("")
  const { currentUser } = useUserStore()
  const { chatId, changeChat } = useChatStore()

  useEffect(() => {
    let latest = 0

    const unsubscribe = onSnapshot(
      collection(db, "userchats", currentUser.id, "chats"),
      async (snap) => {
        const run = ++latest
        const items = await Promise.all(
          snap.docs.map(async (d) => {
            const entry = d.data({ serverTimestamps: "estimate" })
            const userSnap = await getDoc(doc(db, "users", entry.receiverId))
            return { ...entry, user: userSnap.data() }
          })
        )
        // Ignore a slower lookup finishing after a newer snapshot's.
        if (run !== latest) return
        items.sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
        setChats(items.filter((c) => c.user))
      },
      (err) => console.error(err)
    )

    return unsubscribe
  }, [currentUser.id])

  const handleSelect = (chat) => {
    changeChat(chat.chatId, chat.user)
    if (chat.isSeen === false) {
      updateDoc(doc(db, "userchats", currentUser.id, "chats", chat.chatId), { isSeen: true })
        .catch(console.error)
    }
  }

  const term = filter.trim().toLowerCase()
  const visibleChats = term
    ? chats.filter((c) => c.user.username.toLowerCase().includes(term))
    : chats

  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <img src={addMode?"./minus.png":"./plus.png"} alt="" className="add"
        onClick={() => setAddMode((prev)=>!prev)}/>
      </div>
      {chats.length === 0 && (
        <p className="empty">No chats yet. Press + to find someone to talk to.</p>
      )}
      {visibleChats.map((chat) => (
        <div
          className={`item${chat.chatId === chatId ? " active" : ""}${chat.isSeen === false ? " unseen" : ""}`}
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser existingChats={chats} onClose={() => setAddMode(false)} />}
    </div>
  )
}

export default ChatList
