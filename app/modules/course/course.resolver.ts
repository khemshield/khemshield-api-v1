import { getAllCourses } from "./course.service";

export const courseResolvers = {
  courses: async () => getAllCourses(),
};
