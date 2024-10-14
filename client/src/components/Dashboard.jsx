import React from "react";
import Header from "./Header";

const AdminPanelWelcome = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome to the Admin Panel
        </h1>
      </div>
    </div>
  );
};

export default AdminPanelWelcome;
