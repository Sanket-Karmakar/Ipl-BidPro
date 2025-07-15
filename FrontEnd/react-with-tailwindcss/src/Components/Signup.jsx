import React from 'react';

function Signup() {
  return (
    <>
      <div className="h-screen w-screen bg-[#f2f4f7] flex items-center justify-center">
        <div className="left h-[50vh] w-[38vw] min-w-[480px] px-3 py-8 flex flex-col items-center justify-center text-center">
          <img
            src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
            alt="IPL BidPro"
            width="300px"
            className="rounded-2xl mb-4 shadow-lg"
          />
          <p className="text-2xl font-sans text-gray-700 px-6">
            Join IPL BidPro and start creating your ultimate fantasy cricket team today.
          </p>
        </div>

        <div className="right h-[65vh] w-[38vw] min-w-[480px] text-center px-3 py-4">
          <div className="signup-container flex flex-col bg-white rounded-xl w-[425px] h-[400px] shadow-2xl font-sans m-auto">
            <input
              type="text"
              placeholder="Full Name"
              className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="email"
              placeholder="Email address"
              className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="h-12 w-[400px] border rounded-lg border-gray-300 px-3 m-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button className="bg-green-500 text-white w-[200px] rounded-md h-12 mx-auto mt-5 text-[16px] font-bold cursor-pointer transition transform hover:scale-105 hover:brightness-110 shadow-md">
              Sign Up
            </button>
          </div>
          <p className="py-3 text-sm font-sans">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
