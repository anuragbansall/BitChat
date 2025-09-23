import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const { isAuthenticated, isFetchingProfile, logout, allUsers } =
    useContext(AuthContext);

  const { selectedChat, setSelectedChat, chats, setChats, socket } =
    useContext(ChatContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  const handleUserClick = (user) => {
    setSelectedChat(user);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (isFetchingProfile) {
    return (
      <main className="h-screen w-screen bg-dark flex flex-col justify-center items-center text-green">
        <p className="text-2xl">Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <main className="h-screen w-screen bg-dark text-green flex">
      <aside className="w-1/5 h-full border-r border-neutral-800 flex flex-col overflow-y-auto">
        {users.map((user) => (
          <div
            key={user._id}
            className={`border-b border-neutral-800 flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-neutral-800/20 duration-200 ${
              user._id === selectedChat?._id ? "bg-neutral-800/20" : ""
            }`}
            onClick={() => handleUserClick(user)}
          >
            <div className="w-10 h-10 bg-neutral-800/40 uppercase text-lg rounded-full flex items-center justify-center">
              {user.username[0]}
            </div>
            <p className="text-sm">@{user.username}</p>
          </div>
        ))}
      </aside>

      <section className="w-4/5 h-full p-4 flex flex-col">
        <header className="relative border-b border-neutral-800 pb-4 mb-4 flex items-center justify-between">
          <h1 className="text-2xl">BitChat</h1>

          <div
            className="w-10 h-10 bg-neutral-800/40 uppercase text-xl rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-800 duration-200 mt-4"
            onClick={toggleDropdown}
          >
            {allUsers?.find((u) => u._id === selectedChat?._id)?.username[0] ||
              ""}
          </div>
          {isDropdownOpen ? (
            <div className="absolute -bottom-[100%] right-0 py-4 bg-neutral-800/50 border border-neutral-800 flex flex-col px-16 rounded-md backdrop-blur-md">
              <h2
                className="text-lg text-white/80 hover:text-white duration-200 border-b border-neutral-800 pb-2 cursor-pointer hover:border-green"
                onClick={logout}
              >
                Logout
              </h2>
            </div>
          ) : null}
        </header>
        <div className="flex flex-col overflow-y-auto mb-4">
          {chats.map((message) => (
            <div
              key={message.id}
              className={`p-2 my-2 rounded-md ${
                message.senderId === 1 ? "self-end" : "text-white/80"
              }`}
            >
              <p className="text-lg">{message.text}</p>
              <span className="text-xs text-neutral-400">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <form className="mt-auto flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-neutral-800 bg-transparent text-green outline-none focus:border-green rounded-md duration-200"
          />
          <button className="py-2 px-4 rounded-md bg-neutral-800 text-white">
            Send
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;
