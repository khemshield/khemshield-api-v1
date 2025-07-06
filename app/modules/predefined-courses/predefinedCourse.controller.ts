import { Request, Response } from "express";
import predefinedCourseService from "./predefinedCourse.service";

// GET /predefined-courses
export const getAllPredefinedCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await predefinedCourseService.getAllPredefinedCourses();
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch predefined courses", error });
  }
};

// GET /predefined-courses/category/:categoryId
export const getPredefinedCoursesByCategory = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;

  try {
    const courses =
      await predefinedCourseService.getPredefinedCoursesByCategory(categoryId);
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch predefined courses by category",
        error,
      });
  }
};

// POST /predefined-courses
export const createPredefinedCourse = async (req: Request, res: Response) => {
  try {
    const course = await predefinedCourseService.createPredefinedCourse(
      req.body
    );
    res.status(201).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create predefined course", error });
  }
};

// DELETE /predefined-courses/:id
export const deletePredefinedCourse = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await predefinedCourseService.deletePredefinedCourse(id);
    if (!deleted) {
      return res.status(404).json({ message: "Predefined course not found" });
    }

    res.status(200).json({ message: "Predefined course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete predefined course", error });
  }
};
