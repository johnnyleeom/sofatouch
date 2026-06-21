import { useState } from "react";
import { useRef } from "react";

function App() {
  const [ip, setIp] = useState(() => {
    return localStorage.getItem("savedIP") || ""
  });

  const wsRef = useRef<WebSocket | null>(null);

  //for ip
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {

    event.preventDefault();
    console.log(ip);

    const tvIP = ip.trim();
    localStorage.setItem("savedIP", tvIP);
    const url = `wss://${tvIP}:8002/api/v2/channels/samsung.remote.control?name=U29mYVR5cGU=`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Direct browser WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("TV message:", event.data);
    };

    ws.onerror = (error) => {
      console.log("Direct browser WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };
  }

  // for commands (vol_up, vol_down, etc)
  function handleClick(input: string) {
    console.log("User Requested", input);

    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not opened");
      return;
    }

    const payload = {
      method: "ms.remote.control",
      params: {
        Cmd: "Click",
        DataOfCmd: input,
        Option: "false",
        TypeOfRemote: "SendRemoteKey",
      },
    };

    try {
      ws.send(JSON.stringify(payload));
    } catch (err) {
      console.log(err);
    }
  }

  // function for disconnecting
  const handleDisconnect = () => {
    const ws = wsRef.current;

    if (!ws) {
      console.log("No WebSocket to close");
      return;
    }

    ws.close();
    wsRef.current = null;
  };

  return (
    <div style={s.page}>
      <div style={s.remote}>
        {/* IP Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            name="ip"
            type="text"
            placeholder="Tv IP Address"
            onChange={(event) => setIp(event.target.value)}
            value={ip}
            style={s.input}
          />
          <button type="submit" style={s.connectBtn}>
            Submit
          </button>
        </form>

        <div style={s.divider} />

        {/* Home / Back */}
        <div style={s.row}>
          <button onClick={() => handleClick("KEY_HOME")} style={s.smallBtn}>
            Home
          </button>
          <button onClick={() => handleClick("KEY_RETURN")} style={s.smallBtn}>
            Back
          </button>
        </div>

        {/* Vol Up / Down */}
        <div style={s.row}>
          <button onClick={() => handleClick("KEY_VOLUP")} style={s.volBtn}>
            ＋
          </button>
          <button onClick={() => handleClick("KEY_VOLDOWN")} style={s.volBtn}>
            －
          </button>
        </div>

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

        <div style={s.spacer} />

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
    height: "100vh",
    width: "100vw",
    background: "#111113",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  remote: {
    width: "100%",
    maxWidth: 480,
    height: "100%",
    background: "#1c1c1f",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "2.5%",
    padding: "5% 6% 6%",
    border: "1px solid #2e2e35",
    boxSizing: "border-box",
  },
  form: {
    width: "100%",
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: "#28282e",
    border: "1px solid #3a3a42",
    borderRadius: 12,
    color: "#e0e0e0",
    fontSize: "clamp(13px, 4vw, 16px)",
    padding: "3.5% 4%",
    outline: "none",
    fontFamily: "monospace",
    minWidth: 0,
  },
  connectBtn: {
    background: "rgba(74,158,255,0.12)",
    border: "1px solid rgba(74,158,255,0.35)",
    borderRadius: 10,
    color: "#4a9eff",
    fontSize: "clamp(13px, 4vw, 16px)",
    padding: "0 5%",
    cursor: "pointer",
    flexShrink: 0,
  },
  divider: {
    width: "60%",
    height: 1,
    background: "#2a2a30",
    flexShrink: 0,
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  row: {
    width: "100%",
    display: "flex",
    gap: "3%",
    flexShrink: 0,
  },
  smallBtn: {
    flex: 1,
    height: "clamp(44px, 9vh, 64px)",
    borderRadius: 14,
    background: "#252528",
    border: "1px solid #383840",
    color: "#ccc",
    fontSize: "clamp(13px, 3.5vw, 16px)",
    cursor: "pointer",
  },
  volBtn: {
    flex: 1,
    height: "clamp(52px, 10vh, 72px)",
    borderRadius: 16,
    background: "#252528",
    border: "1px solid #383840",
    color: "#ccc",
    fontSize: "clamp(22px, 6vw, 30px)",
    cursor: "pointer",
  },
  dpad: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2%",
    flex: 1,
    width: "100%",
  },
  dpadRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3%",
  },
  dpadBtn: {
    width: "clamp(56px, 16vw, 80px)",
    height: "clamp(56px, 16vw, 80px)",
    borderRadius: 16,
    background: "#252528",
    border: "1px solid #383840",
    color: "#ccc",
    fontSize: "clamp(16px, 4.5vw, 20px)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  okBtn: {
    width: "clamp(56px, 16vw, 80px)",
    height: "clamp(56px, 16vw, 80px)",
    borderRadius: "50%",
    background: "#2e2e38",
    border: "1px solid #4a4a58",
    color: "#e0e0e0",
    fontSize: "clamp(14px, 3.5vw, 17px)",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  disconnectBtn: {
    width: "100%",
    height: "clamp(48px, 9vh, 64px)",
    borderRadius: 16,
    background: "rgba(192,57,43,0.12)",
    border: "1px solid rgba(231,76,60,0.35)",
    color: "#e74c3c",
    fontSize: "clamp(14px, 4vw, 17px)",
    cursor: "pointer",
    letterSpacing: "0.03em",
    flexShrink: 0,
  },
};

export default App;
