import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

// Uploads a file to Cloud Storage and returns its download URL.
const upload = async (file, path) => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}

export default upload
