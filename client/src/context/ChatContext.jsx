import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import API from "../api/axios.js";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);

  // Socket.io client instance
  const socket = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !socket.current) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
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
  }, [isAuthenticated]);

  const getChats = async () => {
    try {
      const chatId = selectedChat?._id;
      const response = await API.get(`/messages/${chatId}`);
      setChats(response.data.data || []);
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
