import express from "express";
import {
  loginController,
  refreshTokenController,
  registerUserController,
  meController,
  requestPasswordResetController,
  resetPasswordController,
  logoutController,
} from "./auth.controller";
import { registerUserSchema } from "./validators/register.validator";
import { validatator } from "../../middlewares/validatator";
import { requireAuth } from "../../middlewares/requireAuth";

const router = express.Router();

// POST /api/v1/auth/register
router.post(
  "/register",
  validatator(registerUserSchema),
  registerUserController
);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/request-password-reset", requestPasswordResetController);
router.post("/reset-password", resetPasswordController);
router.get("/me", requireAuth, meController);
router.post("/logout", logoutController);

// You can later add:
// router.post("/forgot-password", forgotPasswordController);

export default router;
