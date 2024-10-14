import Admin from "../db/models/adminModel.js";
import Employee from "../db/models/employeeModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const admin = await Admin.findOne({ userName });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "365d",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 360000000000,
      })
      .status(200)
      .json({
        admin: {
          id: admin._id,
          userName: admin.userName,
          isAdmin: admin.isAdmin,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { userName, password, email, mobile, designation } = req.body;

    const existingAdmin = await Admin.findOne({
      $or: [{ userName }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      userName,
      password: hashedPassword,
      email,
      mobile,
      designation,
      isAdmin: true,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        userName: newAdmin.userName,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { fullName, password, email, mobile, designation, gender, course } =
      req.body;
    console.log(req.body);
    let profilePic = null;

    if (req.file) {
      profilePic = req.file.filename;
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID (you may want to implement a more robust method)
    const uniqueId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;

    const newEmployee = new Employee({
      uniqueId,
      fullName,
      password: hashedPassword,
      email,
      mobile,
      designation,
      gender,
      course,
      profilePic:
        profilePic ||
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106",
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        uniqueId: newEmployee.uniqueId,
        fullName: newEmployee.fullName,
        email: newEmployee.email,
        profilePic: newEmployee.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password");
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, mobile, designation, gender, course } = req.body;
    console.log(req.body);
    let updateData = {
      fullName,
      email,
      mobile,
      designation,
      gender,
      course,
    };

    if (req.file) {
      updateData.profilePic = req.file.filename;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: {
        id: updatedEmployee._id,
        fullName: updatedEmployee.fullName,
        email: updatedEmployee.email,
        profilePic: updatedEmployee.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, "-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
