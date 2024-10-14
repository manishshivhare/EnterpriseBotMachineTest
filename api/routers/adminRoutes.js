import express from "express";
import {
  loginAdmin,
  createAdmin,
  createEmployee,
  logoutAdmin,
  getEmployees,
  deleteEmployee,
  editEmployee,
  getEmployeeById,
} from "../controllers/adminControllers.js";
import authenticateAdmin from "../middlewares/authenticateAdmin.js";
import {
  validateAdminCreation,
  validateAdminLogin,
  validateEmployeeCreation,
  validateEmployeeEdit,
} from "../middlewares/adminSchemaValidator.js";
import { upload } from "../util/multer.js";

const router = express.Router();

router.post("/login", validateAdminLogin, loginAdmin);
router.post("/create", validateAdminCreation, createAdmin);
router.post(
  "/create-employee",
  authenticateAdmin,
  upload.single("profilePic"),
  validateEmployeeCreation,
  createEmployee
);
router.post("/logout", logoutAdmin);
router.get("/get-employees", authenticateAdmin, getEmployees);
router.get("/get-employee/:id", authenticateAdmin, getEmployeeById);
router.delete("/delete-employee/:id", authenticateAdmin, deleteEmployee);
router.put(
  "/edit-employee/:id",
  authenticateAdmin,
  upload.single("profilePic"),
  validateEmployeeEdit, 
  editEmployee
);

export default router;
