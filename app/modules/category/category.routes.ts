import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller";

const router = Router();

router.post("/", createCategory); // Check role inside controller
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id", updateCategory);
router.get("/:id", deleteCategory);

export default router;
