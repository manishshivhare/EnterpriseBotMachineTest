import { body, validationResult } from "express-validator";

// Helper function for validating profile picture
const validateProfilePic = () => 
  body("profilePic")
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty value
      if (typeof value !== "string") throw new Error("Profile picture must be a string");
      
      const allowedExtensions = ["png", "jpg"];
      const extension = value.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new Error("Profile picture must be in PNG or JPG format");
      }
      return true;
    });

// Admin creation validation
export const validateAdminCreation = [
  body("userName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Admin login validation
export const validateAdminLogin = [
  body("userName").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Employee creation validation
export const validateEmployeeCreation = [
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("gender").isIn(["male", "female"]).withMessage("Gender required"),
  body("course").notEmpty().withMessage("Course is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  validateProfilePic(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Employee edit validation
export const validateEmployeeEdit = [
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("gender").isIn(["male", "female"]).withMessage("Gender required"),
  body("course").notEmpty().withMessage("Course is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  validateProfilePic(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
