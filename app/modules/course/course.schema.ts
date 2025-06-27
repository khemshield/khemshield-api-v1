import { z } from "zod";
import { CourseLevel, DurationUnit, Visibility } from "./course.model";

export const LectureContentSchema = z.object({
  video: z.string().optional(),
  file: z.string().optional(),
  description: z.string().optional(),
});

export const LectureSchema = z.object({
  name: z.string().min(1),
  content: LectureContentSchema.optional(),
});

export const SectionSchema = z.object({
  name: z.string().min(1),
  lectures: z.array(LectureSchema),
});

export const CurriculumSchema = z.object({
  sections: z.array(SectionSchema),
});

export const CourseSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(1), // Mongo ID
    topic: z.string().min(1),
    language: z.string().default("english"),
    level: z.nativeEnum(CourseLevel),
    duration: z.object({
      length: z.number().min(1),
      unit: z.nativeEnum(DurationUnit),
    }),
    thumbnail: z.string().url(),
    trailer: z.string().refine((val) => val === "" || val.startsWith("http"), {
      message: "Trailer must be a valid URL",
    }),
    objectives: z.array(z.string()).max(8),
    targetAudience: z.array(z.string()).max(8),
    requirements: z.array(z.string()).max(8),
    curriculum: CurriculumSchema,
    // leadInstructor: z.string().regex(/^[a-fA-F0-9]{24}$/), // Mongo ID
    instructors: z.array(z.string().min(1)).max(2),
    visibility: z.nativeEnum(Visibility).default(Visibility.Public),
  })
  .strict(); // Ensure no additional fields are allowed;
