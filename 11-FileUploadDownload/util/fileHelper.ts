import { unlink, renameSync } from 'fs';
import { join } from 'path';
import errorMsg from './errorMsg';

const deleteFile = (path: string) => {
  unlink(path, (error) => error && errorMsg({ error, where: 'deleteFile' }));
};

const updateFile = (oldPath: string, fileName: string) => {
  const newPath = join('uploads', fileName); // remove 'temp' subfolder from pathname
  renameSync(oldPath, newPath); // move from uploads/temp to uploads
  return newPath;
}

export { deleteFile, updateFile };
