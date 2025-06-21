import express from "express";
import {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
} from "./course.controller";
// import { requireAuth } from "../../middlewares/auth.middleware"; // Optional, when auth is ready

const router = express.Router();

// Public routes (or later: router.get('/', requireAuth, ...))
router.get("/", getCoursesController);
router.get("/:id", getCourseByIdController);

// Protected routes for instructors
// router.use(requireAuth); // Protect the routes below when auth is added
router.post("/", createCourseController);
router.patch("/:id", updateCourseController);
router.delete("/:id", deleteCourseController);

export default router;
