import { z } from "zod";

export const CreateCollaborationRequestSchema = z.object({
  course: z.string().min(1),
  message: z.string().optional(),
});
