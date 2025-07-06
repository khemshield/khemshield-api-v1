// models/course.model.ts

import { Schema, model, Document, Types } from "mongoose";
import slugify from "slugify";

// ---------- CONSTANTS ----------
const MAX_OBJECTIVES = 8;
const MAX_TARGET_AUDIENCE = 8;
const MAX_REQUIREMENTS = 8;

// ---------- ENUMS ----------
export enum CourseLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  BeginnerIntermediate = "beginner_intermediate",
  Advanced = "advance",
}

export enum DurationUnit {
  Day = "day",
  Week = "week",
  Month = "month",
}

export enum CourseStatus {
  Draft = "draft",
  Pending = "pending_review",
  Published = "published",
  Rejected = "rejected",
}

export enum Visibility {
  Public = "public",
  Private = "private",
}

// ---------- INTERFACES ----------
export interface ILectureContent {
  video?: string;
  file?: string;
  description?: string;
}

export interface ILecture {
  name: string;
  content?: ILectureContent;
}

export interface ICourseSection {
  name: string;
  lectures: ILecture[];
}

export interface ICourseCurriculum {
  sections: ICourseSection[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  topic: string;
  language: string;
  level: CourseLevel;
  duration: {
    length: number;
    unit: DurationUnit;
  };
  price: number;
  createdFrom: Types.ObjectId;
  isSystemGenerated: boolean;
  thumbnail: string;
  trailer?: string;
  objectives: string[];
  targetAudience: string[];
  requirements: string[];
  curriculum: ICourseCurriculum;
  leadInstructor: Types.ObjectId;
  instructors: Types.ObjectId[];
  discountPercentage: number;
  slug: string;
  version: number;
  status: CourseStatus;
  visibility: Visibility;
  createdAt?: Date;
  updatedAt?: Date;
}

// ---------- SUBSCHEMAS ----------
const lectureContentSchema = new Schema<ILectureContent>({
  video: String,
  file: String,
  description: String,
});

const lectureSchema = new Schema<ILecture>({
  name: { type: String, required: true },
  content: lectureContentSchema,
});

const sectionSchema = new Schema<ICourseSection>({
  name: { type: String, required: true },
  lectures: [lectureSchema],
});

const curriculumSchema = new Schema<ICourseCurriculum>({
  sections: [sectionSchema],
});

// ---------- MAIN SCHEMA ----------
const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, unique: true, required: true },

    description: { type: String, required: true },

    category: { type: String, required: true },

    topic: { type: String, required: true },

    language: { type: String, default: "english" },

    level: {
      type: String,
      enum: Object.values(CourseLevel),
      required: true,
    },

    duration: {
      length: { type: Number, required: true },
      unit: {
        type: String,
        enum: Object.values(DurationUnit),
        required: true,
      },
    },
    discountPercentage: { type: Number, max: 100, min: 0, default: 0 },
    thumbnail: { type: String, required: true },

    price: { type: Number, required: true },

    createdFrom: { type: Schema.Types.ObjectId, ref: "PredefinedCourse" },

    isSystemGenerated: { type: Boolean, default: false },

    trailer: String,

    objectives: {
      type: [String],
      validate: [
        (arr: string[]) => arr.length <= MAX_OBJECTIVES,
        `Max ${MAX_OBJECTIVES} objectives allowed.`,
      ],
    },

    targetAudience: {
      type: [String],
      validate: [
        (arr: string[]) => arr.length <= MAX_TARGET_AUDIENCE,
        `Max ${MAX_TARGET_AUDIENCE} target audience entries allowed.`,
      ],
    },

    requirements: {
      type: [String],
      validate: [
        (arr: string[]) => arr.length <= MAX_REQUIREMENTS,
        `Max ${MAX_REQUIREMENTS} requirements allowed.`,
      ],
    },

    curriculum: curriculumSchema,

    leadInstructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    instructors: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
      validate: [
        {
          validator: (arr: Types.ObjectId[]) => arr.length <= 2,
          message: "At most 2 instructors allowed",
        },
      ],
    },

    // ---------- Additional Info ----------
    slug: {
      type: String,
      unique: true,
      required: true,
      // 🔖 SEO-friendly identifier generated from course title
    },

    version: {
      type: Number,
      default: 1,
      // Tracks course revisions (useful for versioning curriculum)
    },

    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.Draft,
      // Current state of the course: draft, pending_review (submitted), published, rejected, etc.
    },

    visibility: {
      type: String,
      enum: Object.values(Visibility),
      default: Visibility.Public,
      // Who can see the course: public or private/internal only
    },
  },
  { timestamps: true }
);

// ---------- PRE-SAVE HOOK TO GENERATE SLUG ----------
courseSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// ---------- EXPORT ----------
const Course = model<ICourse>("Course", courseSchema);
export default Course;
