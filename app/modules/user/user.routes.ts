// routes/user.routes.ts
import express from "express";
import {
  createUserController,
  getUsersController,
  searchUsersController,
} from "./user.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { checkRole } from "../../middlewares/checkRole"; // optional RBAC middleware
import { UserRole } from "./user.model";

const router = express.Router();

router.get("/search", requireAuth, searchUsersController); // optional: checkRole(UserRole.Admin)
router.post("/", requireAuth, checkRole(UserRole.Admin), createUserController);
router.get("/", requireAuth, checkRole(UserRole.Admin), getUsersController);

export default router;
