import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore"
import { db } from "./firebase"

// Two people always share the same chat id, so adding someone twice reopens
// the existing chat instead of creating a duplicate.
export const chatIdFor = (uidA, uidB) => [uidA, uidB].sort().join("_")

// Creates the chat between two users if it doesn't exist yet and makes sure
// it is in both users' chat lists. Returns the chat id.
export const startChat = async (myId, otherId) => {
  const chatId = chatIdFor(myId, otherId)
  const chatRef = doc(db, "chats", chatId)
  const chatSnap = await getDoc(chatRef)

  const batch = writeBatch(db)

  if (!chatSnap.exists()) {
    batch.set(chatRef, {
      members: [myId, otherId],
      createdAt: serverTimestamp()
    })
  }

  // Merge so an existing entry keeps its last message and seen state.
  const entry = (receiverId) => ({
    chatId,
    receiverId,
    updatedAt: serverTimestamp()
  })
  batch.set(doc(db, "userchats", myId, "chats", chatId), { ...entry(otherId), isSeen: true }, { merge: true })
  batch.set(doc(db, "userchats", otherId, "chats", chatId), entry(myId), { merge: true })

  await batch.commit()
  return chatId
}
