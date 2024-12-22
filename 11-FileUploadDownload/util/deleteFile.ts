import { unlink } from 'fs';
import errorMsg from './errorMsg';

export const deleteFile = (path: string) => {
  unlink(path, (error) => error && errorMsg({ error, where: 'deleteFile' }));
};
