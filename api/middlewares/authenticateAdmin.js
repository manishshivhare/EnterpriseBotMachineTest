import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../db/models/adminModel.js";

const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Admin.findById(decoded.id, "-password");
    if (!user || !user.isAdmin) {
      return res.status(404).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticateAdmin;
