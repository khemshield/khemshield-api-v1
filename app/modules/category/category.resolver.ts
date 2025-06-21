import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from "./category.service";

// Flattened version — matches your schema exactly
export const categoryResolvers = {
  categories: async () => getAllCategories(),
  getCategory: async ({ id }: { id: string }) => getCategoryById(id),
  createCategory: async ({ input }: any) => createCategory(input),
  deleteCategory: async ({ id }: { id: string }) => deleteCategory(id),
};
