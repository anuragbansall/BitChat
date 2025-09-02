import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const users = [
  { id: 1, username: "user1", email: "user1@example.com" },
  { id: 2, username: "auser2", email: "user2@example.com" },
  { id: 3, username: "xuser3", email: "user3@example.com" },
];

const messages = [
  {
    id: 1,
    senderId: 1, // logged in user
    receiverId: 2, // chatting with user
    text: "Hey, how are you?",
    timestamp: "2024-06-01T10:00:00Z",
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    text: "I'm good! How about you?",
    timestamp: "2024-06-01T10:01:00Z",
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    text: "Doing well, thanks! Working on a new project.",
    timestamp: "2024-06-01T10:02:00Z",
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 1,
    text: "That sounds interesting. Tell me more!",
    timestamp: "2024-06-01T10:03:00Z",
  },
  {
    id: 1,
    senderId: 1, // logged in user
    receiverId: 2, // chatting with user
    text: "Hey, how are you?",
    timestamp: "2024-06-01T10:00:00Z",
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    text: "I'm good! How about you?",
    timestamp: "2024-06-01T10:01:00Z",
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    text: "Doing well, thanks! Working on a new project.",
    timestamp: "2024-06-01T10:02:00Z",
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 1,
    text: "That sounds interesting. Tell me more!",
    timestamp: "2024-06-01T10:03:00Z",
  },
];

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, isFetchingProfile, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

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
            key={user.id}
            className="border-b border-neutral-800 flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-neutral-800/20 duration-200"
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
            {"anurag"[0]}
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
          {messages.map((message) => (
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
