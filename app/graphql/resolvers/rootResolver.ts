import { eventResolvers } from "../../modules/event/event.resolver";
import { contactResolvers } from "../../modules/contact/contact.resolver";
import { categoryResolvers } from "../../modules/category/category.resolver";
import { predefinedCourseResolvers } from "../../modules/predefined-courses/predefinedCourse.resolver";
import { courseResolvers } from "../../modules/course/course.resolver";

const appResolvers = {
  ...eventResolvers,
  ...contactResolvers,
  ...categoryResolvers,
  ...predefinedCourseResolvers,
  ...courseResolvers,
};

export default appResolvers;
