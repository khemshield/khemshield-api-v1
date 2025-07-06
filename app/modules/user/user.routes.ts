// routes/user.routes.ts
import express from "express";
import {
  createUserController,
  getUsersController,
  searchUsersController,
  getUserController,
} from "./user.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { checkRole } from "../../middlewares/checkRole"; // optional RBAC middleware
import { UserRole } from "./user.model";

const router = express.Router();

router.use(requireAuth, checkRole(UserRole.Admin));
router.get("/search", searchUsersController); // optional: checkRole(UserRole.Admin)
router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserController);

export default router;
