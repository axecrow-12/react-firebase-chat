import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "./login.css"

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  useEffect(() => {
    return () => {
      if (avatar.url) URL.revokeObjectURL(avatar.url)
    }
  }, [avatar.url])

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar({
      file,
      url: URL.createObjectURL(file)
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.target))

    if (!email || !password) return toast.warn("Please enter your email and password")

    // TODO: sign in with Firebase Auth
    toast.info("Sign in is not connected to Firebase yet")
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const { username, email, password } = Object.fromEntries(new FormData(e.target))

    if (!username || !email || !password) return toast.warn("Please fill in every field")
    if (password.length < 6) return toast.warn("Password must be at least 6 characters")

    // TODO: create the account with Firebase Auth and upload the avatar
    toast.info("Sign up is not connected to Firebase yet")
  }

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" autoComplete="email" />
          <input type="password" placeholder="Password" name="password" autoComplete="current-password" />
          <button>Sign In</button>
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
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default Login
