import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import Header from "./Header";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/admin/get-employees");
        setEmployeeList(response.data.employees);
      } catch (err) {
        setError("Failed to fetch employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = () => {
    navigate("/admin/add-employee");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.trim());
  };

  const filteredEmployees = useMemo(() => {
    return employeeList.filter((employee) =>
      [
        employee.fullName,
        employee.email,
        employee.mobile,
        employee.uniqueId,
      ].some((field) =>
        field?.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    );
  }, [employeeList, searchTerm]);

  const handleEdit = (employeeId) => {
    navigate(`/admin/edit-employee/${employeeId}`);
    console.log("Edit employee with ID:", employeeId);
  };

  const handleDelete = async (employeeId) => {
    console.log("Delete employee with ID:", employeeId);
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/admin/delete-employee/${employeeId}`);
        setEmployeeList(employeeList.filter((emp) => emp._id !== employeeId));
      } catch (error) {
        console.error("Failed to delete employee:", error);
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading employees...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full flex flex-col p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Employee List
          </h1>

          <div className="flex justify-between items-center mb-4">
            <p className="text-base font-medium text-gray-700">
              Total Employees: {filteredEmployees.length}
            </p>
            <button
              onClick={handleAddEmployee}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors shadow-md"
            >
              Create Employee
            </button>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search Employee by name, email, mobile or unique ID"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            />
            <button className="ml-2 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Search className="text-gray-600" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {[
                    "Unique ID",
                    "Image",
                    "Name",
                    "Email",
                    "Mobile No",
                    "Designation",
                    "Gender",
                    "Course",
                    "Create Date",
                    "Actions",
                  ].map((heading, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-xs font-semibold text-gray-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {employee.uniqueId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img
                        src={
                          `http://localhost:3001/public/Images/` +
                          employee.profilePic
                        }
                        alt={`${employee.fullName}'s profile`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {employee.fullName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a
                        href={`mailto:${employee.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {employee.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {employee.mobile}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {employee.designation}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {employee.gender}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {Array.isArray(employee.course)
                        ? employee.course.join(", ")
                        : employee.course}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {dayjs(employee.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                          onClick={() => handleEdit(employee._id)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 transition-colors"
                          onClick={() => handleDelete(employee._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeList;
