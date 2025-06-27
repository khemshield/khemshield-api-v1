import express from "express";
import {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  checkCourseExistenceController,
} from "./course.controller";
import { requireAuth } from "../../middlewares/requireAuth";
// import { requireAuth } from "../../middlewares/auth.middleware"; // Optional, when auth is ready

const router = express.Router();

// Public routes (or later: router.get('/', requireAuth, ...))
router.get("/", getCoursesController);
router.get("/:id", getCourseByIdController);

// Protected routes for
router.use(requireAuth); // Protect the routes below
router.post("/", createCourseController);
router.patch("/:id", updateCourseController);
router.delete("/:id", deleteCourseController);
router.post("/check-existence", checkCourseExistenceController); // Optional, if you want to check existence before creating

export default router;
