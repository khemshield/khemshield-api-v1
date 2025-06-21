// routes/user.routes.ts
import express from "express";
import { createUserController } from "./user.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { checkRole } from "../../middlewares/checkRole"; // optional RBAC middleware
import { UserRole } from "./user.model";

const router = express.Router();

router.post("/", requireAuth, checkRole(UserRole.Admin), createUserController);

export default router;
