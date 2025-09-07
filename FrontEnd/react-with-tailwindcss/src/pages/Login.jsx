import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { AuthLayout } from "../components/AuthLayout.jsx";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/profile", { replace: true });
    }
  };

  return (
    <div className="h-screen w-screen bg-[#f2f4f7] flex items-center justify-center">
      <div className="left h-[60vh] w-[38vw] min-w-[480px] px-3 py-16 flex flex-col items-center justify-center text-center">
        <img
          src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
          alt="IPL BidPro"
          width="300px"
          className="rounded-2xl mb-6 shadow-lg"
        />
        <p className="text-2xl font-sans text-gray-700 px-6">
          IPL BidPro helps you analyze player stats to build your fantasy dream team.
        </p>
      </div>

      <div className="right h-[60vh] w-[38vw] min-w-[480px] text-center px-3 py-6">
        <div className="login-container flex flex-col bg-white rounded-xl w-[425px] h-[425px] shadow-2xl font-sans m-auto py-4">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

            <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-600 rounded-lg h-12 w-[400px] mx-auto text-[18px] font-bold cursor-pointer transition transform hover:scale-105 hover:brightness-110 shadow-md"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <p className="text-blue-600 pt-3.5 pb-5 hover:underline text-sm cursor-pointer">
            Forgot password?
          </p>
          <hr className="border-gray-300 w-[390px] mx-auto" />
          <Link
            to="/signup"
            className="bg-green-500 text-white w-[200px] rounded-md h-12 mx-auto mt-5 flex items-center justify-center text-[16px] font-bold cursor-pointer transition transform hover:scale-105 hover:brightness-110 shadow-md"
          >
            Create new account
          </Link>
        </div>
        <p className="py-2 text-sm font-sans">
          <b className="hover:underline cursor-pointer">Create a Page</b> for your fantasy league or cricket community.
        </p>
      </div>
    </div>
  );
};

export default Login;
