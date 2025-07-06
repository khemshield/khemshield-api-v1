import { Router } from "express";
import { checkRole } from "../../middlewares/checkRole";
import { UserRole } from "../user/user.model";
import { recordManualPaymentController } from "./payment.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

router.post(
  "/manual",
  requireAuth,
  checkRole(UserRole.Admin),
  recordManualPaymentController
);

export default router;
