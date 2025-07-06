// utils/course/ensureCourseFromPredefined.ts

import { Types } from "mongoose";
import Course, {
  CourseLevel,
  CourseStatus,
  Visibility,
} from "../../course/course.model";
import PredefinedCourse from "../../../modules/predefined-courses/predefinedCourse.model";
import { AppError } from "../../../utils/errors";

export const ensureCourseFromPredefined = async (
  predefinedCourseId: Types.ObjectId
) => {
  console.log(" ensureCourseFromPredefined  CALLED");

  // 1. Check if a course has already been created from this predefined course
  const existing = await Course.findOne({ createdFrom: predefinedCourseId });

  console.log(" existing: ", existing);
  if (existing) return existing;

  // 2. Fetch the predefined course
  const template = await PredefinedCourse.findById(predefinedCourseId);
  if (!template) throw new AppError("Predefined course not found", 404);

  // 3. Create a new real course from it
  const newCourse = await Course.create({
    title: template.title,
    description: template.description,
    category: template.category,
    topic: template.title,
    price: template.basePrice,
    duration: template.baseDuration,
    thumbnail: "/images/thumnail_placeholder.svg",
    level: CourseLevel.BeginnerIntermediate,
    createdFrom: template._id,
    visibility: Visibility.Private,
    status: CourseStatus.Pending, // System-generated, no instructor yet
    isSystemGenerated: true,
  });

  return newCourse;
};
