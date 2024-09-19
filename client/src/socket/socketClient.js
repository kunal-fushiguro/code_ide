import { io } from "socket.io-client";

const socketClinet = io("http://localhost:9000/");

export { socketClinet };
