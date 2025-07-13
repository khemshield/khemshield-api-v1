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

router.use(requireAuth);

router.get(
  "/search",
  checkRole(UserRole.Admin, UserRole.Instructor),
  searchUsersController
);

router.use(checkRole(UserRole.Admin));
router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserController);

export default router;
