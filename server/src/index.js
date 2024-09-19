import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import pty from "node-pty";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new SocketServer({ cors: "*" });

io.attach(server);
app.use(cors({ origin: "*" }));

server.listen(9000, () => {
  console.log("Server Started on PORT : 9000");
});

const ptyProcess = pty.spawn("bash", [], {
  name: "xterm-color",
  cols: 300,
  rows: 100,
  cwd: process.env.INIT_CWD + "/user",
  env: process.env,
});

app.get("/files", async (req, res) => {
  const fileTree = await generateFileTree("./user");
  return res.json({ tree: fileTree });
});

io.on("connection", (socket) => {
  console.log("Socket Connection stablished :" + socket.id);
  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });
});

ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});

async function generateFileTree(directory) {
  const tree = {};

  async function buildTree(currentDir, currentTree) {
    const files = await fs.readdir(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file]);
      } else {
        currentTree[file] = null;
      }
    }
  }

  await buildTree(directory, tree);
  return tree;
}
