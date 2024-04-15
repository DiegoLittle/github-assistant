import { useState } from "react"
import SignIn from "./components/SignIn"
import './styles.css'
function OptionsIndex() {
  const [apiKey, setAPIKey] = useState("")

  return (
    <div>
      <h1>
        Settings
      </h1>
      <label
      className={`mb-3 text-xl font-bold block`}
      >
        API Key:
      </label>
      <input
      style={{
        borderRadius: 4,
        padding: 4,
        border: "1px solid #888",
      }}
       onChange={(e) => setAPIKey(e.target.value)} value={apiKey} />

       <SignIn />
    </div>
  )
}

export default OptionsIndex