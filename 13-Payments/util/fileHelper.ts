import { unlink, renameSync, readdir } from 'fs';
import { join } from 'path';
import logger from './logger';

const deleteFile = (path: string) => {
  unlink(path, (error) => error && logger(500, { deleteFile: error }));
};

const clearTempFiles = (userID: string) => {
  const tempDir = join('uploads', 'temp');

  readdir(tempDir, (error, files) => {
    if (error) {
      logger(500, { clearTempFiles: error });
      return;
    }

    files.forEach((file) => {
      if (file.startsWith(userID)) {
        const filePath = join(tempDir, file);
        unlink(filePath, (error) => {
          if (error) logger(500, { UnableToDeleteFile: error, filePath });
          else       logger(200, { DeletedFile: filePath });
        });
      }
    });
  });
};


export { deleteFile, clearTempFiles };
