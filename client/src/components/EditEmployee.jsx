import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { Camera } from "lucide-react";

const EditEmployee = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`/api/admin/get-employee/${id}`);
        const employee = response.data.employee;
        setFormData({
          fullName: employee.fullName,
          email: employee.email,
          mobileNo: employee.mobile,
          designation: employee.designation,
          gender: employee.gender,
          course: Array.isArray(employee.course) ? employee.course : employee.course.split(","), // Ensure course is an array
        });
        setImagePreview(`http://localhost:3001/public/Images/${employee.profilePic}`);
      } catch (error) {
        setError("Failed to fetch employee data");
      }
    };
  
    fetchEmployeeData();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        course: checked
          ? [...prevState.course, value] 
          : prevState.course.filter((course) => course !== value), 
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2000000) { // Check file size < 2MB
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prevState) => ({
          ...prevState,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError("File is too large. Please upload a file smaller than 2MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!/^[\d]{10}$/.test(formData.mobileNo)) {
      setError("Please enter a valid 10-digit mobile number.");
      setIsLoading(false);
      return;
    }

    const Data = new FormData();
    Data.append("fullName", formData.fullName);
    Data.append("email", formData.email);
    Data.append("mobile", formData.mobileNo);
    Data.append("designation", formData.designation);
    Data.append("gender", formData.gender);
    Data.append("course", formData.course.join(','));
    if (formData.image) {
      Data.append("profilePic", formData.image);
    }

    try {
      const response = await axios.put(`/api/admin/edit-employee/${id}`, Data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        navigate("/admin/employee-list");
      } else {
        setError(response.data.message || "An error occurred while updating the employee.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while updating the employee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <main className="h-full flex flex-col p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Employee</h1>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile No
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      id="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                      disabled={isLoading}
                    >
                      <option value="">Select Designation</option>
                      <option value="HR">HR</option>
                      <option value="Manager">Manager</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                          required
                          className="form-radio text-green-500"
                          disabled={isLoading}
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                          required
                          className="form-radio text-green-500"
                          disabled={isLoading}
                        />
                        <span className="ml-2">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <div className="flex flex-wrap gap-4">
                      {["MCA", "BCA", "BSC"].map((course) => (
                        <label key={course} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="course"
                            value={course}
                            checked={formData.course.includes(course)}
                            onChange={handleChange}
                            className="form-checkbox text-green-500"
                            disabled={isLoading}
                          />
                          <span className="ml-2">{course}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleImageUpload}
                        className="w-full p-2 text-sm"
                        accept="image/*"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600 transition duration-200 disabled:bg-gray-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Update Employee"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEmployee;
