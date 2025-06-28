// services/collaboration.service.ts
import { Types } from "mongoose";
import Course from "../course/course.model";
import CollaborationRequest, {
  RequestStatus,
} from "./collaboration-request.model";
import User from "../user/user.model";
import sendEmail from "../../utils/emailService/sendEmail";
import { collabRequestNotificationTemplate } from "../../utils/emailService/mail_templates/collab-request-notification-template";
import { collabResponseNotificationTemplate } from "../../utils/emailService/mail_templates/collab-response-notification-template";

import { CLIENT_BASE_URL } from "../../config/contants";

export const createCollaborationRequest = async ({
  course,
  requesterId,
  message,
}: {
  course: string;
  requesterId: string;
  message?: string;
}) => {
  const lastRequest = await CollaborationRequest.findOne({
    course,
    requester: requesterId,
  }).sort({ updatedAt: -1 });

  if (lastRequest) {
    if (lastRequest.status === RequestStatus.Pending) {
      throw new Error("You already have a pending request for this course");
    }

    if (
      lastRequest.status === RequestStatus.Rejected &&
      lastRequest.updatedAt &&
      Date.now() - lastRequest.updatedAt.getTime() < 1000 * 60 * 60 * 24
    ) {
      throw new Error("You must wait 24 hours before re-requesting");
    }
  }

  const foundCourse = await Course.findById(course).populate("leadInstructor");
  if (!foundCourse) throw new Error("Course not found");

  if (foundCourse.leadInstructor.toString() === requesterId.toString()) {
    throw new Error("You are already the lead instructor for this course");
  }

  const newRequest = new CollaborationRequest({
    course,
    requester: requesterId,
    leadInstructor: foundCourse.leadInstructor._id,
    message,
  });

  await newRequest.save();

  // 📩 Notify lead instructor
  const leadInstructor = foundCourse.leadInstructor as any;
  const requester = await User.findById(requesterId);

  await sendEmail({
    email: leadInstructor.email,
    subject: "New Collaboration Request",
    html: collabRequestNotificationTemplate({
      leadInstructorName: leadInstructor.firstName,
      requesterName: `${requester?.firstName} ${requester?.lastName}`,
      courseTitle: foundCourse.title,
      message,
      actionUrl: `${CLIENT_BASE_URL}/requests`,
    }),
  });

  return newRequest;
};
export const getMyCollabRequests = async (userId: Types.ObjectId) => {
  return await CollaborationRequest.find({
    requester: userId,
  })
    .populate("course", "title slug")
    .sort({ createdAt: -1 });
};

export const getIncomingRequests = async (leadInstructorId: Types.ObjectId) => {
  return await CollaborationRequest.find({
    leadInstructor: leadInstructorId,
    status: "pending",
  })
    .populate("requester", "firstName lastName email")
    .populate("course", "title slug");
};

export const respondToRequest = async ({
  requestId,
  userId,
  action,
}: {
  requestId: string;
  userId: Types.ObjectId;
  action: "accept" | "reject";
}) => {
  if (!["accept", "reject"].includes(action)) {
    throw new Error("Invalid action");
  }

  const request = await CollaborationRequest.findById(requestId)
    .populate("course")
    .populate("requester");

  if (!request) throw new Error("Request not found");

  if (request.leadInstructor.toString() !== userId.toString()) {
    throw new Error("Only the lead instructor can respond to this request");
  }

  request.status =
    action === "accept" ? RequestStatus.Accepted : RequestStatus.Rejected;
  await request.save();

  if (action === "accept") {
    const course = await Course.findById(request.course._id);
    if (course && !course.instructors.includes(request.requester)) {
      course.instructors.push(request.requester);
      await course.save();
    }
  }

  // 📩 Notify requester
  const requester = request.requester as any;
  const course = request.course as any;

  await sendEmail({
    email: requester.email,
    subject: `Your collaboration request was ${action}ed`,
    html: collabResponseNotificationTemplate({
      requesterName: requester.firstName,
      courseTitle: course.title,
      action: action === "accept" ? "accepted" : "rejected",
    }),
  });

  return `Request ${action}ed successfully`;
};
