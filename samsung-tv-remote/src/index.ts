import WebSocket = require("ws");

function initialize(ipAddress: string) {
  const tvIP = ipAddress;
  const appName = "SofaType";
  const encodedAppName = Buffer.from(appName).toString("base64");
  const url = `wss://${tvIP}:8002/api/v2/channels/samsung.remote.control?name=${encodedAppName}`;
}

function startWebsocket(url: string) {
  const ws = new WebSocket(url, {
    rejectUnauthorized: false,
  });

  ws.on("open", () => {
    console.log("Connected to TV");

    setTimeout(() => {
      console.log("Closing connection");
      ws.close();
    }, 1000);
  });

  ws.on("message", (data) => {
    console.log("Message from TV:", data.toString());
  });

  ws.on("error", (error) => {
    console.log("WebSocket error:", error.message);
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
}

module.exports = initialize;
