import WebSocket = require("ws");

const tvIP = "192.168.68.121"
const appName = "SofaType";
const encodedAppName = Buffer.from(appName).toString("base64");

const url = `wss://${tvIP}:8002/api/v2/channels/samsung.remote.control?name=${encodedAppName}`;

console.log("URL created:", url)

const ws = new WebSocket(url, {
  rejectUnauthorized: false,
});

console.log("Connecting to TV");

ws.on("open", () => {
  console.log("Connected to TV");

  const command = {
    method: "ms.remote.control",
    params: {
      Cmd: "Click",
      DataOfCmd: "KEY_VOLUP",
      Option: "false",
      TypeOfRemote: "SendRemoteKey",
    },
  };

  for(let i:number = 0; i < 10; i ++ ) {
    setTimeout(() => {
  }, 3000);

    console.log("Sending command:", command.params.DataOfCmd);
    ws.send(JSON.stringify(command));
  }

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



