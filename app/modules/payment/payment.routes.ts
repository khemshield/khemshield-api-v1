import { Router } from "express";
import { checkRole } from "../../middlewares/checkRole";
import { UserRole } from "../user/user.model";
import {
  fetchPaymentssByUser,
  recordManualPaymentController,
} from "./payment.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

router.use(requireAuth, checkRole(UserRole.Admin));

// POST /api/payments/manual
router.post(
  "/manual",

  recordManualPaymentController
);

// GET /api/payments/user/:userId
router.get("/user/:userId", fetchPaymentssByUser);

export default router;
