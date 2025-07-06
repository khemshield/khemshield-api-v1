import predefinedCourseService from "./predefinedCourse.service";

export const predefinedCourseResolvers = {
  predefinedCourses: async () =>
    predefinedCourseService.getAllPredefinedCourses(),

  getPredefinedCoursesByCategory: async ({
    categoryId,
  }: {
    categoryId: string;
  }) => predefinedCourseService.getPredefinedCoursesByCategory(categoryId),
};
