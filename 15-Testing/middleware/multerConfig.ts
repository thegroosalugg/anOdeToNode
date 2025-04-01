import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// configures multer file destination and filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // callback successful, 1: error as null, 2: destination string
    callback(null, 'uploads');
  },

  filename: (req, file, callback) => {
    const dateStr = new Date().toISOString().replace(/[:.-]/g, '_');
    callback(null, dateStr + '_' + file.originalname);
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
