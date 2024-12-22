import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const fileDate = new Date().toISOString().replace(/[:.-]/g, '_') + '_';

// configures multer file destination and filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // null is placeholder to pass an error, but it must be null.
    callback(null, 'uploads');
  },
     filename: (req, file, callback) => {
    callback(null, fileDate + file.originalname);
  },
});

// adds a file filter for accepted filetypes in multer
const fileFilter = (
       req: Request,
      file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  const isValid = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);
  // 1st arg is always null regardless of errors
  callback(null, isValid);
};

export { storage, fileFilter };
