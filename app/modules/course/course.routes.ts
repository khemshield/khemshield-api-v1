import express from "express";
import {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  checkCourseExistenceController,
  getMyCoursesController,
} from "./course.controller";
import { requireAuth } from "../../middlewares/requireAuth";
// import { requireAuth } from "../../middlewares/auth.middleware"; // Optional, when auth is ready

const router = express.Router();

// Protected Route
router.get("/my", requireAuth, getMyCoursesController); // place before :id

// Public routes
router.get("/:id", getCourseByIdController);
router.get("/", getCoursesController);

// Protected Routes (requireAuth middleware applies to all below)
router.use(requireAuth);

router.post("/", createCourseController);
router.post("/check-existence", checkCourseExistenceController);
router.patch("/:id", updateCourseController);
router.delete("/:id", deleteCourseController);

export default router;
