import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth";
import { checkRole } from "../../middlewares/checkRole";
import { UserRole } from "../user/user.model";
import {
  createCouponController,
  deleteCouponController,
  getAllCouponsController,
  getCouponByIdController,
  updateCouponController,
  verifyCouponController,
} from "./coupon.controller";

const router = Router();

// Admin-only routes
router.use(requireAuth, checkRole(UserRole.Admin));

// This should go BEFORE the admin-only middleware if you want it to be public
router.post("/", createCouponController); // e.g., POST /api/coupons
router.get("/", getAllCouponsController);
router.get("/:id", getCouponByIdController);
router.put("/:id", updateCouponController);
router.delete("/:id", deleteCouponController);

// Public coupon verification route (e.g. for UI "Apply Coupon" button)
router.get("/verify", verifyCouponController);

export default router;
