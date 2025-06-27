import e from "express";
import Course, { ICourse } from "./course.model";
import { IUser } from "../user/user.model";
import { IInstructorProfile } from "../user/instructorProfile.model";

// Create course
export const createCourse = async (data: Partial<ICourse>) => {
  const course = new Course(data);
  return await course.save();
};

// Get all courses
export const getAllCourses = async () => {
  return await Course.find().populate("category").populate("instructors");
};

// Get course by ID
export const getCourseById = async (id: string) => {
  return await Course.findById(id).populate("category").populate("instructors");
};

// Get course by slug (for SEO/public display)
export const getCourseBySlug = async (slug: string) => {
  return await Course.findOne({ slug })
    .populate("category")
    .populate("instructors");
};

// Update course
export const updateCourse = async (
  id: string,
  data: Partial<ICourse>
): Promise<ICourse | null> => {
  const course = await Course.findById(id);

  if (!course) return null;

  // Versioning: increment version only if course is published and meaningful fields change
  const meaningfulFields = [
    "title",
    "description",
    "objectives",
    "curriculum",
    "requirements",
  ];

  //   This only checks if a field is present in the reques - suitable for patch only
  //   const shouldBumpVersion =
  //     course.status === "published" &&
  //     meaningfulFields.some((field) => data[field as keyof ICourse]);

  const shouldBumpVersion =
    course.status === "published" &&
    meaningfulFields.some((field) => {
      const newValue = data[field as keyof ICourse];
      const oldValue = course[field as keyof ICourse];
      return (
        newValue !== undefined &&
        JSON.stringify(newValue) !== JSON.stringify(oldValue)
      );
    });

  if (shouldBumpVersion) {
    course.version += 1;
  }

  // Apply updates
  Object.assign(course, data);

  return course.save();
};

// Delete course
export const deleteCourse = async (id: string) => {
  return await Course.findByIdAndDelete(id);
};

// Check if a course with same title or topic exists (optional for validation)
export const courseExists = async (query: {
  topic: string;
  category: string;
}) => {
  const course = await Course.findOne(query).populate<{
    leadInstructor: IUser & { instructorProfile: IInstructorProfile };
  }>({
    path: "leadInstructor",
    select: "firstName lastName email instructorProfile",
    populate: {
      path: "instructorProfile",
      select: "avatar", // get only what you need
    },
  });

  if (!course) {
    return { exists: false };
  }

  const user = course.leadInstructor;
  const instructorProfile = user.instructorProfile as IInstructorProfile;

  return {
    exists: true,
    _id: course._id,
    title: course.title,
    topic: course.topic,
    instructorCount: course.instructors.length,
    leadInstructor: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: instructorProfile?.avatar || null,
    },
  };
};
