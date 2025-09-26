import { createContext, useContext, useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import API from "../api/axios.js";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState(null);

  const { isAuthenticated, token } = useContext(AuthContext);
  // For production, consider using a logging library instead of console.log
  // Example: logger.debug("Token", token);

  // Socket.io client instance
  const socket = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !socket.current) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        auth: { token }, // pass token here
      });

      // Optionally, handle connect/disconnect events
      socket.current.on("connect", () => {
        // Socket connected
      });

      socket.current.on("disconnect", () => {
        // Handle socket disconnect if needed
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isAuthenticated, token]);

  const SHARED_SECRET = import.meta.env.VITE_APP_SHARED_SECRET;
  const getChats = async () => {
    try {
      const chatId = selectedChat?._id;
      const response = await API.get(`/messages/${chatId}`);
      // Decrypt each message
      const decryptedChats = (response.data.data || []).map((msg) => {
        let decrypted = "";
        try {
          const bytes = CryptoJS.AES.decrypt(msg.content, SHARED_SECRET);
          decrypted = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
          decrypted = "[Decryption failed]";
        }
        return {
          ...msg,
          content: decrypted,
        };
      });
      setChats(decryptedChats);
    } catch (error) {
      setChatsError(error?.response?.data?.message || "Failed to load chats");
    } finally {
      setChatsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      getChats();
    }
  }, [selectedChat, isAuthenticated]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        isAuthenticated,
        socket: socket.current,
        getChats,
        chatsLoading,
        chatsError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
