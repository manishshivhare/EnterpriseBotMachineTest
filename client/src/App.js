import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import CreateEmployee from "./components/CreateEmployee";
import Dashboard from "./components/Dashboard";
import OnlyAdminRoute from "./components/OnlyAdminRoute";
import EmployeeList from "./components/EmployeeList";
import EditEmployee from "./components/EditEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={<OnlyAdminRoute />}>
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-employee" element={<CreateEmployee />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
