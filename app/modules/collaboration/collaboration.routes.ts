import { Router } from "express";
import {
  createCollabRequestController,
  getMyCollabRequestsController,
  getIncomingRequestsController,
  respondToRequestController,
} from "./collaboration.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

// Protected Routes (requireAuth middleware applies to all below)
router.use(requireAuth);

// Request to join a course
router.post("/", createCollabRequestController);

// View your own requests
router.get("/my-requests", getMyCollabRequestsController);

// Lead instructor: View incoming requests for their courses
router.get("/incoming", getIncomingRequestsController);

// Lead instructor: Accept or reject a request
router.patch("/:requestId/respond", respondToRequestController);

export default router;
