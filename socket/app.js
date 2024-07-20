import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173","http://195.200.14.15:8800"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      // Handle case when receiver is not found
      console.log("Receiver not found");
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
