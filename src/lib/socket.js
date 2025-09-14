import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// used to store online users
const userSocketMap = {}; // { userId: socketId }

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://chat-app-frontend-omega-sand.vercel.app"
    ],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;


   // Join group rooms
    socket.on("join-group", (groupId) => {
        if (groupId) {
            socket.join(groupId);
            console.log(` User ${userId} joined group: ${groupId}`);
        }
    });

    socket.on("leave-group", (groupId) => {
        if (groupId) {
            socket.leave(groupId);
            console.log(` User ${userId} left group: ${groupId}`);
        }
    });

    // Add group typing events
socket.on("group-typing-start", (data) => {
  const { groupId } = data;
  
  // Broadcast to all group members except sender
  socket.to(groupId).emit("group-user-typing", {
    userId: socket.userId,
    groupId: groupId
  });
});

socket.on("group-typing-stop", (data) => {
  const { groupId } = data;
  
  // Broadcast to all group members except sender
  socket.to(groupId).emit("group-user-stop-typing", {
    userId: socket.userId,
    groupId: groupId
  });
});

  // send online users list to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing events
  socket.on("typing-start", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-typing", {
        userId: userId
      });
    }
  });

  socket.on("typing-stop", (data) => {
    const { receiverId } = data;
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-stop-typing", {
        userId: userId
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(" A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };