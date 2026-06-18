import WebSocket from "ws";
import express from "express";
import { initialize } from "./index.js";
import { startWebsocket } from "./index.js";

const app = express();
const port = 3000;

//allows connection from many different servers to my backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

let tvSocket: WebSocket | null = null;

app.listen(port, () => {
  console.log(`Port opened on: ${port}`);
});

app.post("/api/connect", async (req: any, res: any) => {
  const { ip } = req.body;
  const url = initialize(ip);

  try {
    tvSocket = await startWebsocket(url);
    res.json({
      success: true,
      message: "Connection Success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Connection Failed",
    });
  }
});

app.post("/api/disconnect", async (req: any, res: any) => {
  if (!tvSocket) {
    return res.status(400).json({
      success: false,
      message: "No active connection",
    });
  }

  tvSocket.on("close", () => {
    console.log("Connection closed");
  });

  tvSocket.close();

  res.json({
    success: true,
    message: "Successfully Disconnected",
  });
});

app.post("/control/command", async (req: any, res: any) => {
  try {
    if (!tvSocket || tvSocket.readyState !== WebSocket.OPEN) {
      return res.status(400).json({
        success: false,
        message: "WebSocket is not connected",
      });
    }
    const { command } = req.body;
    const payload = {
      method: "ms.remote.control",
      params: {
        Cmd: "Click",
        DataOfCmd: command,
        Option: "false",
        TypeOfRemote: "SendRemoteKey",
      },
    };
    tvSocket.send(JSON.stringify(payload), (error) => {
      if (error) {
        console.log("Command failed");
        return res.status(400).json({
          success: false,
          message: `Unsuccessful ${command}`,
        });
      } else {
        res.json({
          success: true,
          message: `Successful: ${command}`,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
});
