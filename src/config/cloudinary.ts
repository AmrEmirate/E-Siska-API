import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getResourceType = (mimetype: string): "image" | "raw" | "auto" => {
  const imageMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  if (imageMimes.includes(mimetype)) {
    return "image";
  }
  return "raw";
};

export const cloudinaryUpload = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceType(file.mimetype);
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (err, result) => {
        if (err) {
          reject(err);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload failed: no result returned"));
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
