import { Request, Response } from "express";
import categoryService from "./category.service";

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// Get all categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// Get single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};
