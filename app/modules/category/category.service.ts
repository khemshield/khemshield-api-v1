import Category, { ICategory } from "./category.model";

export const getAllCategories = async () => await Category.find<ICategory[]>();

export const getCategoryById = async (id: string) =>
  await Category.findById(id);

export const createCategory = async (data: ICategory) =>
  await Category.create(data);

export const deleteCategory = async (id: string) =>
  await Category.findByIdAndDelete(id);

export const updateCategory = async (id: string, data: Partial<ICategory>) =>
  await Category.findByIdAndUpdate(id, data, { new: true });

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
};
