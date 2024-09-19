import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import pty from "node-pty";

const app = express();
const server = http.createServer(app);
const io = new SocketServer({ cors: "*" });

io.attach(server);

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

io.on("connection", (socket) => {
  console.log("Socket Connection stablished :" + socket.id);
  socket.on("terminal:write", (data) => {
    ptyProcess.write(data);
  });
});

ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});
