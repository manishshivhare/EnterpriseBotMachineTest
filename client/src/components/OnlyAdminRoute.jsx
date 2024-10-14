import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

const OnlyAdminRoute = () => {
  const { admin } = useAuthStore();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default OnlyAdminRoute;
