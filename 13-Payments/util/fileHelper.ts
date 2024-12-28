import { unlink, renameSync, readdir } from 'fs';
import { join } from 'path';
import errorMsg from './errorMsg';

const deleteFile = (path: string) => {
  unlink(path, (error) => error && errorMsg({ error, where: 'deleteFile' }));
};

const clearTempFiles = (userID: string) => {
  const tempDir = join('uploads', 'temp');

  readdir(tempDir, (error, files) => {
    if (error) {
      errorMsg({ error, where: 'clearTempFiles' })
      return;
    }

    files.forEach((file) => {
      if (file.startsWith(userID)) {
        const filePath = join(tempDir, file);
        unlink(filePath, (error) => {
          if (error) {
            errorMsg({ error, where: 'Unable to delete' + filePath });
          } else {
            console.log('Deleted file:', filePath);
          }
        });
      }
    });
  });
};


export { deleteFile, clearTempFiles };
