import express from "express";
import {
  getAllPredefinedCourses,
  getPredefinedCoursesByCategory,
  createPredefinedCourse,
  deletePredefinedCourse,
} from "./predefinedCourse.controller";

const router = express.Router();

router.get("/", getAllPredefinedCourses);
router.get("/category/:categoryId", getPredefinedCoursesByCategory);
router.post("/", createPredefinedCourse);
router.delete("/:id", deletePredefinedCourse);

export default router;
