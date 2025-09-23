import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/connectDB.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./src/models/message.model.js";

const PORT = config.port;
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // set to your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // allow credentials
  },
});

const userSocketMap = new Map(); // userId → socketId

// Middleware for socket authentication
io.use((socket, next) => {
  const token = socket.handshake.query.token || socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    socket.userId = decoded.id;

    return next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// Handle connections
io.on("connection", (socket) => {
  const userId = socket.userId;
  userSocketMap.set(userId, socket.id);
  console.log(`✅ User ${userId} connected (socket ${socket.id})`);

  // Listen for chat messages
  socket.on("chatMessage", async ({ message, receiver }) => {
    console.log(`📩 Message from ${userId} to ${receiver}: ${message}`);
    if (!message || !receiver) {
      console.error("❌ Invalid chatMessage data");
      return socket.emit("error", "Invalid message data");
    }

    const payload = {
      message,
      sender: userId,
      receiver,
      createdAt: new Date(),
    };

    try {
      await Message.create({
        sender: userId,
        receiver,
        content: message,
      });

      console.log("✅ Message saved:", payload);

      // Send to receiver if online
      const receiverSocketId = userSocketMap.get(receiver);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("chatMessage", payload);
      }

      // Send back to sender (for confirmation/UI update)
      socket.emit("chatMessage", payload);
    } catch (err) {
      console.error("❌ Failed to save message:", err.message);
      socket.emit("error", "Failed to save message. Please try again.");
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    userSocketMap.delete(userId);
    console.log(`🔴 User ${userId} disconnected (socket ${socket.id})`);
  });
});

server.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await connectDB();
});
