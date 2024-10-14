import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  designation: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  createAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("admin", adminSchema);
export default Admin;
