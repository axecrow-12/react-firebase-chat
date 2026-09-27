import List from "./components/list/List"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"

// TODO: replace with the signed in Firebase user
const user = null

const App = () => {
  return (
    <div className='container'>
      {user ? (
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
