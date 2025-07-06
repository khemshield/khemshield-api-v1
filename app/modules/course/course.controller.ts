import { Request, Response } from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  courseExists,
  getCoursesByUser,
} from "./course.service";

import { CourseSchema } from "./course.validation";
import { CourseStatus, Visibility } from "./course.model";
import { Types } from "mongoose";

// Create Course
export const createCourseController = async (req: Request, res: Response) => {
  try {
    const parsed = CourseSchema.safeParse(req.body); // Validated payload

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { category, topic } = parsed.data;

    // Optional: Prevent duplicates
    const exists = await courseExists({ topic, category });
    if (exists)
      return res.status(409).json({ message: "Course already being managed" });

    const currentUser = req.user!;

    const course = await createCourse(
      {
        ...req.body,
        // Securely inject leadInstructor from authenticated user
        leadInstructor: currentUser._id,
      },
      currentUser
    );

    res.status(201).json(course);
  } catch (err) {
    console.error("Create Course Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Courses
export const getCoursesController = async (_: Request, res: Response) => {
  try {
    const courses = await getAllCourses({
      status: CourseStatus.Published, // Only fetch published courses
      visibility: Visibility.Public, // Only fetch public courses
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to get courses" });
  }
};

// Get My Courses (for authenticated user)
export const getMyCoursesController = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { status, visibility } = req.query;

    const courses = await getCoursesByUser({
      userId: user._id as Types.ObjectId,
      filters: {
        status: status as CourseStatus | undefined,
        visibility: visibility as Visibility | undefined,
      },
    });

    res.json(courses);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ message: "Failed to get your courses" });
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

// Check Course Existence (optional, e.g. before creating)
export const checkCourseExistenceController = async (
  req: Request,
  res: Response
) => {
  const { topic, category } = req.body;
  if (!topic || !category) {
    return res.status(400).json({ message: "Topic and category are required" });
  }

  const result = await courseExists({ topic, category });

  if (result.exists) {
    return res.status(409).json({ message: "Course already exists", result });
  }

  res.status(200).json({ message: "Course does not exist", exists: false });
};
