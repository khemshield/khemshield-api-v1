import { z } from "zod";

export const enrollmentQuerySchema = z.object({
  userId: z.string().optional(),
  courseId: z.string().optional(),
  status: z.enum(["active", "completed", "dropped"]).optional(),
});
