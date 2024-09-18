import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer({ cors: "*" });

io.attach(server);

server.listen(9000, () => {
  console.log("Server Started on PORT : 9000");
});
