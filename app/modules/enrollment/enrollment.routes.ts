import express from "express";
import {
  fetchAllEnrollments,
  fetchEnrollmentById,
  fetchEnrollmentsByUser,
} from "./enrollment.controller";

const router = express.Router();

// @route   GET /api/enrollments
router.get("/", fetchAllEnrollments);

// @route   GET /api/enrollments/:id
router.get("/:id", fetchEnrollmentById);

// @route   GET /api/enrollments/user/:userId
router.get("/user/:userId", fetchEnrollmentsByUser);

export default router;
