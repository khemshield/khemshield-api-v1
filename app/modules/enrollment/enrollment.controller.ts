import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentsByUser,
} from "./enrollment.service";
import { enrollmentQuerySchema } from "./enrollment.validation";

// GET /api/enrollments
export const fetchAllEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    enrollmentQuerySchema.parse(req.query);

    const { userId, courseId, status } = req.query;
    const enrollments = await getAllEnrollments({
      userId: userId as string,
      courseId: courseId as string,
      status: status as any,
    });
    res.json({ data: enrollments });
  }
);

// GET /api/enrollments/:id
export const fetchEnrollmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment = await getEnrollmentById(req.params.id);
    res.json({ data: enrollment });
  }
);

// GET /api/enrollments/user/:userId
export const fetchEnrollmentsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const enrollments = await getEnrollmentsByUser(userId);
    res.json({ data: enrollments });
  }
);
