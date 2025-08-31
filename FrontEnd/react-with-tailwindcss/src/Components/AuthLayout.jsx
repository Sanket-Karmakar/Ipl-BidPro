// components/AuthLayout.jsx
import React from "react";

export default function AuthLayout({ title, children }) {
  return (
    <div className="h-screen w-screen bg-[#f2f4f7] flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <img
          src="https://i.pinimg.com/736x/96/21/49/962149f905f2598b3e71887fafb2708f.jpg"
          alt="IPL BidPro"
          width="250"
          className="rounded-2xl mb-4 shadow-md"
        />
        <p className="text-xl text-gray-700 mb-6 max-w-md">
          IPL BidPro helps you analyze player stats to build your fantasy dream team.
        </p>

        <div className="bg-white rounded-xl shadow-2xl p-6 w-[425px] font-sans">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
