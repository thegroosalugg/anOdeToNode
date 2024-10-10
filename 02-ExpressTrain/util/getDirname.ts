import { fileURLToPath } from 'url';
import { dirname } from 'path';

// replaces commonJS __dirname
export const getDirname = () => dirname(fileURLToPath(import.meta.url));
