import React from "react";
import useDateStore from "../zustand/authStore";
import axios from "axios";

const Header = () => {
  const { admin } = useDateStore();
  const handleLogut = () => {
    try {
      axios.post("/api/admin/logout").then((response) => {
        if (response.status !== 200) {
          throw new Error("An error occurred during logout");
        }
      });
      useDateStore.setState({ admin: null });
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-500 shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-white text-lg font-bold">Company Logo</span>
          <nav className="hidden sm:flex space-x-4">
            <a href="/admin/dashboard" className="text-white hover:text-blue-300">
              Home
            </a>
            <a href="/admin/employee-list" className="text-white hover:text-blue-300">
              Employee List
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white">@{admin?.userName}</span>
          <button
            onClick={handleLogut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
