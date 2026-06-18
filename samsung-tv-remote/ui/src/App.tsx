import { useState } from "react";

function App() {
  const [ip, setIp] = useState("");
  //eslint-disable-next-line
  const [submittedIp, setSubmittedIp] = useState("");
  //eslint-disable-next-line
  const [cmd, setCmd] = useState("");

  //for ip
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmittedIp(ip);
    console.log(ip);

    const response = await fetch("http://localhost:3000/api/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ip: ip,
      }),
    });

    const res = await response.json();
    console.log(res.message);
  }

  // for commands (vol_up, vol_down, etc)
  async function handleClick(input) {
    setCmd(input);
    console.log("User Requested", input);

    const response = await fetch("http://localhost:3000/control/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: input,
      }),
    });

    const res = await response.json();
    console.log(res.message);
  }

  const handleDisconnect = async () => {
    const response = await fetch("http://localhost:3000/api/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    console.log(res.message);
  };

  return (
    <div style={s.page}>
      <div style={s.remote}>
        {/* IP Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            name="ip"
            type="text"
            placeholder="IP address of the TV"
            onChange={(event) => setIp(event.target.value)}
            value={ip}
            style={s.input}
          />
          <button type="submit" style={s.connectBtn}>
            Submit
          </button>
        </form>

        <div style={s.divider} />

        {/* Vol Up */}
        <button onClick={() => handleClick("KEY_VOLUP")} style={s.volBtn}>
          ＋
        </button>

        {/* Vol Down */}
        <button onClick={() => handleClick("KEY_VOLDOWN")} style={s.volBtn}>
          －
        </button>

        <div style={s.divider} />

        {/* D-Pad */}
        <div style={s.dpad}>
          {/* Up */}
          <div style={s.dpadRow}>
            <button onClick={() => handleClick("KEY_UP")} style={s.dpadBtn}>
              ▲
            </button>
          </div>

          {/* Left / OK / Right */}
          <div style={s.dpadRow}>
            <button onClick={() => handleClick("KEY_LEFT")} style={s.dpadBtn}>
              ◀
            </button>
            <button onClick={() => handleClick("KEY_ENTER")} style={s.okBtn}>
              OK
            </button>
            <button onClick={() => handleClick("KEY_RIGHT")} style={s.dpadBtn}>
              ▶
            </button>
          </div>

          {/* Down */}
          <div style={s.dpadRow}>
            <button onClick={() => handleClick("KEY_DOWN")} style={s.dpadBtn}>
              ▼
            </button>
          </div>
        </div>

        <div style={s.divider} />

        {/* Disconnect */}
        <button onClick={handleDisconnect} style={s.disconnectBtn}>
          Disconnect
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#111113",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  remote: {
    width: 240,
    background: "#1c1c1f",
    borderRadius: 40,
    padding: "28px 22px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    border: "1px solid #2e2e35",
  },
  form: {
    width: "100%",
    display: "flex",
    gap: 6,
  },
  input: {
    flex: 1,
    background: "#28282e",
    border: "1px solid #3a3a42",
    borderRadius: 10,
    color: "#e0e0e0",
    fontSize: 11,
    padding: "8px 10px",
    outline: "none",
    fontFamily: "monospace",
    minWidth: 0,
  },
  connectBtn: {
    background: "rgba(74,158,255,0.12)",
    border: "1px solid rgba(74,158,255,0.35)",
    borderRadius: 8,
    color: "#4a9eff",
    fontSize: 11,
    padding: "8px 12px",
    cursor: "pointer",
    flexShrink: 0,
  },
  divider: {
    width: "60%",
    height: 1,
    background: "#2a2a30",
  },
  volBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    background: "#252528",
    border: "1px solid #383840",
    color: "#ccc",
    fontSize: 22,
    cursor: "pointer",
  },
  dpad: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  dpadRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  dpadBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#252528",
    border: "1px solid #383840",
    color: "#ccc",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  okBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    background: "#2e2e38",
    border: "1px solid #4a4a58",
    color: "#e0e0e0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  disconnectBtn: {
    width: "100%",
    height: 44,
    borderRadius: 14,
    background: "rgba(192,57,43,0.12)",
    border: "1px solid rgba(231,76,60,0.35)",
    color: "#e74c3c",
    fontSize: 13,
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
};

export default App;
