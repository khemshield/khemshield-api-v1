import { Types } from "mongoose";
import { IInstructorProfile } from "../user/instructorProfile.model";
import { IUser } from "../user/user.model";
import Course, { CourseStatus, ICourse, Visibility } from "./course.model";
import { generateCourseCreatedEmailHTMLTemp } from "../../utils/emailService/mail_templates/generateCourseCreatedEmailHTMLTemp";
import sendEmail from "../../utils/emailService/sendEmail";
import { CLIENT_BASE_URL } from "../../config/contants";
// Create course
export const createCourse = async (data: Partial<ICourse>, user: IUser) => {
  const course = new Course(data);

  await sendEmail({
    email: user.email,
    subject: `Course Created: ${course.title}`,
    html: generateCourseCreatedEmailHTMLTemp({
      courseTitle: course.title,
      topic: course.topic,
      category: course.category,
      thumbnail: course.thumbnail, // Make sure it's a full URL
      createdAt: course.createdAt?.toISOString() || new Date().toISOString(),
      courseLink: `${CLIENT_BASE_URL}/courses/${course.slug}`,
      userName: `${user.firstName} ${user.lastName}`,
    }),
  });

  return await course.save();
};

// Get all courses
export const getAllCourses = async (filters?: {
  status?: CourseStatus;
  visibility?: Visibility;
}) => {
  const query: any = {};

  if (filters?.status) query.status = filters.status;
  if (filters?.visibility) query.visibility = filters.visibility;

  return await Course.find(query).select("-curriculum"); // if needed to avoid heavy payloads;
};

// Get courses by user (for lead instructor or instructors)
export const getCoursesByUser = async ({
  userId,
  filters,
}: {
  userId: Types.ObjectId;
  filters?: {
    status?: string;
    visibility?: string;
  };
}) => {
  const query: any = {
    $or: [{ leadInstructor: userId }, { instructors: userId }],
  };

  if (filters?.status) query.status = filters.status;
  if (filters?.visibility) query.visibility = filters.visibility;

  return Course.find(query).populate(
    "leadInstructor",
    "firstName lastName email"
  );
};

// Get course by ID
export const getCourseById = async (id: string) => {
  return await Course.findById(id)
    .populate("leadInstructor")
    .populate("instructors");
};

// Get course by slug (for SEO/public display)
export const getCourseBySlug = async (slug: string) => {
  return await Course.findOne({ slug })
    .populate("leadInstructor")
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
  const course = await Course.findOne(query)
    .populate<{
      leadInstructor: IUser & { instructorProfile: IInstructorProfile };
    }>({
      path: "leadInstructor",
      select: "firstName lastName email instructorProfile",
      populate: {
        path: "instructorProfile",
        select: "avatar", // get only what you need
      },
    })
    .populate("instructors", "email");

  if (!course) {
    return { exists: false };
  }

  const leadIntructor = course.leadInstructor;
  const instructorProfile =
    leadIntructor.instructorProfile as IInstructorProfile;

  return {
    exists: true,
    _id: course._id,
    title: course.title,
    topic: course.topic,
    instructors: course.instructors,
    leadInstructor: {
      _id: leadIntructor._id,
      name: `${leadIntructor.firstName} ${leadIntructor.lastName}`,
      email: leadIntructor.email,
      avatar: instructorProfile?.avatar || null,
    },
  };
};
