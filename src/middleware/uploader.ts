import multer from "multer";

export const uploaderMemory = (fileSize: number = 1 * 1024 * 1024) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize },
  });
};
