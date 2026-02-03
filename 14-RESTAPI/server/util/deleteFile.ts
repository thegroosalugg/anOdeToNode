import { unlink } from 'fs';
import captainsLog from './captainsLog';

export const deleteFile = (path: string) => {
  unlink(path, (error) => {
    if (error) captainsLog(500, { fsUnlink: error });
  });
};
