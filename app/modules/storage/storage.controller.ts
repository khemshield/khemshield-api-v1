// controllers/storage.controller.ts
import { Request, Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Config } from "../../config/aws-config";

const BUCKET = process.env.AWS_BUCKET_NAME!;

export const generateS3UploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, folder } = req.body;

    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Config, command, { expiresIn: 60 });

    console.log("RESPONSE", { url, key });

    return res.json({ url, key }); //  Send key back to frontend
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
};

// initiate upload
export const initiateUpload = async (req: Request, res: Response) => {
  const { fileName, fileType, folder } = req.body;
  const key = `${folder}/${Date.now()}-${fileName}`;

  const cmd = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });
  const { UploadId } = await s3Config.send(cmd);

  return res.json({ key, uploadId: UploadId });
};

// get upload part url
export const getUploadPartUrl = async (req: Request, res: Response) => {
  const { key, uploadId, partNumber } = req.body;
  const cmd = new UploadPartCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    Body: "",
  });
  const url = await getSignedUrl(s3Config, cmd, { expiresIn: 300 });

  return res.json({ url });
};

// complete multipart
export const completeMultipart = async (req: Request, res: Response) => {
  const { key, uploadId, parts } = req.body;
  const cmd = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });
  await s3Config.send(cmd);
  return res.json({
    url: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  });
};

// abort multipart
export const abortMultipart = async (req: Request, res: Response) => {
  const { key, uploadId } = req.body;
  const cmd = new AbortMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
  });
  await s3Config.send(cmd);
  return res.json({ aborted: true });
};

export const deleteS3File = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const key = decodeURIComponent(new URL(url).pathname.substring(1)); // remove bucket name from path
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Config.send(command);
    return res.status(200).json({ message: `File deleted` });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res
      .status(500)
      .json({ error: (error as Error).message || "Failed to delete file " });
  }
};
