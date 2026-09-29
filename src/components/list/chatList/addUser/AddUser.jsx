import { useState } from "react"
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "../../../../lib/firebase"
import { startChat } from "../../../../lib/chats"
import { useChatStore } from "../../../../lib/chatStore"
import { useUserStore } from "../../../../lib/userStore"
import "./addUser.css"

const AddUser = ({ existingChats, onClose }) => {
  const { currentUser } = useUserStore()
  const { changeChat } = useChatStore()
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [addingId, setAddingId] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    const term = new FormData(e.target).get("username").trim().toLowerCase()
    if (!term) return

    setSearching(true)
    try {
      // Usernames starting with the search term.
      const q = query(
        collection(db, "users"),
        where("usernameLower", ">=", term),
        where("usernameLower", "<=", term + ""),
        limit(10)
      )
      const snap = await getDocs(q)
      setResults(snap.docs.map((d) => d.data()).filter((u) => u.id !== currentUser.id))
    } catch (err) {
      console.error(err)
      toast.error("Search failed, please try again")
    } finally {
      setSearching(false)
    }
  }

  const handleAdd = async (user) => {
    const existing = existingChats.find((c) => c.receiverId === user.id)
    if (existing) {
      changeChat(existing.chatId, user)
      onClose()
      return
    }

    setAddingId(user.id)
    try {
      const chatId = await startChat(currentUser.id, user.id)
      changeChat(chatId, user)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error("Could not start the chat, please try again")
      setAddingId(null)
    }
  }

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" autoComplete="off" autoFocus />
        <button disabled={searching}>{searching ? "Searching" : "Search"}</button>
      </form>
      {results && results.length === 0 && <p className="empty">No users found</p>}
      {results?.map((user) => {
        const alreadyChatting = existingChats.some((c) => c.receiverId === user.id)
        return (
          <div className="user" key={user.id}>
            <div className="detail">
              <img src={user.avatar || "./avatar.png"} alt="" />
              <span>{user.username}</span>
            </div>
            <button onClick={() => handleAdd(user)} disabled={addingId !== null}>
              {alreadyChatting ? "Open" : addingId === user.id ? "Adding" : "Add User"}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default AddUser
