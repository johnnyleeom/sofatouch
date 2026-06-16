import { useState } from 'react'
import "./App.css";

function App() {

  const [ip, setIp] = useState("");
  const [submittedIp, setSubmittedIp] = useState("");
  const [cmd, setCmd] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedIp(ip)
    console.log(submittedIp)

  }

  function handleClick(input) {
    setCmd(input)
    console.log("User Requested", cmd)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
      <input
        name="ip" 
        type="text"
        placeholder="ip Address of the tv"
        onChange={(event) => setIp(event.target.value)}
        value={ip}
      />
      <button type="submit">Submit</button>
    </form>
      <button onClick={() => handleClick("VOL_UP")} style={{ color: "red", width: "100px", height: "100px" }}>
        up
      </button>
      <button onClick={() => handleClick("VOL_DOWN")} style={{ color: "red", width: "100px", height: "100px" }}>
        down
      </button>
    </>
  );
}

export default App;
