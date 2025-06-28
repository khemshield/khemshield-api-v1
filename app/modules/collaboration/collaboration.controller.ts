// controllers/collaboration.controller.ts
import { Request, Response } from "express";

import {
  createCollaborationRequest,
  getMyCollabRequests,
  getIncomingRequests,
  respondToRequest,
} from "./collaboration.service";

export const createCollabRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const request = await createCollaborationRequest({
      course: req.body.course,
      requesterId: req.user._id,
      message: req.body.message,
    });

    res.status(201).json(request);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyCollabRequestsController = async (
  req: Request,
  res: Response
) => {
  const requests = await getMyCollabRequests(req.user._id);
  res.json(requests);
};

export const getIncomingRequestsController = async (
  req: Request,
  res: Response
) => {
  const requests = await getIncomingRequests(req.user._id);
  res.json(requests);
};

export const respondToRequestController = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { action } = req.body;

  try {
    const result = await respondToRequest({
      requestId,
      userId: req.user._id,
      action,
    });

    res.status(200).json({ message: result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
