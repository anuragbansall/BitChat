import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await register({ username, password });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <main className="h-screen flex flex-col justify-center items-center bg-dark text-green">
      <div className="p-8 py-12 w-lg rounded-lg bg-neutral-900/50 border border-neutral-500">
        <h1 className="text-4xl font-semibold mb-8 text-center">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-red-500">{error}</p>

          <button
            type="submit"
            className="bg-green text-dark p-2 rounded mt-6"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <Link
          to="/login"
          className="text-green/70 hover:underline mt-4 block text-center"
        >
          Already have an account? Login
        </Link>
      </div>
    </main>
  );
};

export default Register;
