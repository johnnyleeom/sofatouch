import WebSocket from "ws";

export function initialize(ipAddress: string) {
  const tvIP = ipAddress;
  const appName = "SofaType";
  const encodedAppName = Buffer.from(appName).toString("base64");
  const url = `wss://${tvIP}:8002/api/v2/channels/samsung.remote.control?name=${encodedAppName}`;

  return url;
}

export function startWebsocket(url: string):Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, {
      rejectUnauthorized: false,
    });

    ws.on("open", () => {
      console.log("Connected to TV");
      resolve(ws);
    });

    ws.on("error", (error) => {
      console.log("WebSocket error:", error.message);
      reject(error);
    });
  });
}
