import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../../lib/firebase"
import upload from "../../lib/upload"
import "./login.css"

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

const errorMessages = {
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/invalid-email": "That email address is not valid",
  // Which of these three a bad sign in returns depends on the project's
  // email enumeration protection setting.
  "auth/invalid-credential": "Wrong email or password",
  "auth/wrong-password": "Wrong email or password",
  "auth/user-not-found": "Wrong email or password",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/too-many-requests": "Too many attempts, please wait a moment and try again",
  "auth/network-request-failed": "Could not reach Firebase, check your connection",
}

const describeError = (err) => errorMessages[err.code] || "Something went wrong, please try again"

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (avatar.url) URL.revokeObjectURL(avatar.url)
    }
  }, [avatar.url])

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > MAX_AVATAR_BYTES) return toast.warn("Image must be smaller than 5 MB")
    setAvatar({
      file,
      url: URL.createObjectURL(file)
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.target))

    if (!email || !password) return toast.warn("Please enter your email and password")

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error(err)
      toast.error(describeError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { username, email, password } = Object.fromEntries(new FormData(e.target))

    if (!username.trim() || !email || !password) return toast.warn("Please fill in every field")
    if (password.length < 6) return toast.warn("Password must be at least 6 characters")

    setLoading(true)
    let newUser = null
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      newUser = res.user

      const avatarUrl = avatar.file
        ? await upload(avatar.file, `avatars/${newUser.uid}/${Date.now()}_${avatar.file.name}`)
        : ""

      // Write the chat list first: App treats the users document as the
      // signal that the account is ready.
      await setDoc(doc(db, "userchats", newUser.uid), {
        chats: []
      })
      await setDoc(doc(db, "users", newUser.uid), {
        id: newUser.uid,
        username: username.trim(),
        avatar: avatarUrl,
        blocked: []
      })

      toast.success("Account created, welcome!")
    } catch (err) {
      console.error(err)
      // Don't leave a half created account behind that can sign in but has no profile.
      if (newUser) await deleteUser(newUser).catch(console.error)
      toast.error(describeError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" autoComplete="email" />
          <input type="password" placeholder="Password" name="password" autoComplete="current-password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input type="file" id="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder="Username" name="username" autoComplete="username" />
          <input type="email" placeholder="Email" name="email" autoComplete="email" />
          <input type="password" placeholder="Password" name="password" autoComplete="new-password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
