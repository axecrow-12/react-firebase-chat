import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import List from "./components/list/List"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { auth, db, isFirebaseConfigured } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"

const App = () => {
  const { currentUser, isLoading, setCurrentUser } = useUserStore()

  useEffect(() => {
    if (!isFirebaseConfigured) return

    let unsubscribeProfile = () => {}

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeProfile()
      if (!user) {
        unsubscribeProfile = () => {}
        setCurrentUser(null)
        return
      }
      // Follow the profile rather than reading it once: on sign up the auth
      // user exists a moment before its profile document is written.
      unsubscribeProfile = onSnapshot(
        doc(db, "users", user.uid),
        (snap) => setCurrentUser(snap.exists() ? snap.data() : null),
        (err) => {
          console.error(err)
          setCurrentUser(null)
        }
      )
    })

    return () => {
      unsubscribeAuth()
      unsubscribeProfile()
    }
  }, [setCurrentUser])

  if (!isFirebaseConfigured) {
    return (
      <div className="notice">
        <h2>Firebase is not configured</h2>
        <p>Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Firebase web config, then restart <code>npm run dev</code>.</p>
      </div>
    )
  }

  if (isLoading) return <div className="notice">Loading...</div>

  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List/>
          <Chat/>
          <Detail/>
        </>
      ) : (
        <Login/>
      )}
      <Notification/>
    </div>
  )
}

export default App
