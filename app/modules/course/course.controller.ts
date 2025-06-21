import { Request, Response } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  courseExists,
} from "./course.service";

// Create Course
export const createCourseController = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    // Optional: Prevent duplicates
    const exists = await courseExists(title);
    if (exists)
      return res.status(409).json({ message: "Course already exists" });

    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    console.error("Create Course Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Courses
export const getCoursesController = async (_: Request, res: Response) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to get courses" });
  }
};

// Get Course by ID
export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course" });
  }
};

// Get Course by Slug (optional for SEO-friendly routes)
export const getCourseBySlugController = async (
  req: Request,
  res: Response
) => {
  try {
    const course = await getCourseBySlug(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course" });
  }
};

// Update Course
export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error updating course" });
  }
};

// Delete Course
export const deleteCourseController = async (req: Request, res: Response) => {
  try {
    const result = await deleteCourse(req.params.id);
    if (!result) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
};
