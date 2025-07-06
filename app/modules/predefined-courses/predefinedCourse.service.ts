import PredefinedCourse, { IPredefinedCourse } from "./predefinedCourse.model";

export const getAllPredefinedCourses = async (): Promise<IPredefinedCourse[]> =>
  await PredefinedCourse.find();

export const getPredefinedCoursesByCategory = async (
  categoryId: string
): Promise<IPredefinedCourse[]> =>
  await PredefinedCourse.find({ category: categoryId });

export const createPredefinedCourse = async (
  data: Partial<IPredefinedCourse>
) => await PredefinedCourse.create(data);

export const deletePredefinedCourse = async (id: string) =>
  await PredefinedCourse.findByIdAndDelete(id);

export default {
  getAllPredefinedCourses,
  getPredefinedCoursesByCategory,
  createPredefinedCourse,
  deletePredefinedCourse,
};
