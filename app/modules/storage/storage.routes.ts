import { Router } from "express";
import {
  abortMultipart,
  completeMultipart,
  deleteS3File,
  generateS3UploadUrl,
  getUploadPartUrl,
  initiateUpload,
} from "./storage.controller";

const router = Router();

router.post("/generate-s3-upload-url", generateS3UploadUrl);
router.post("/delete-s3-file", deleteS3File);
router.post("/initiate", initiateUpload);
router.post("/upload-part", getUploadPartUrl);
router.post("/complete", completeMultipart);
router.post("/abort", abortMultipart);

export default router;
