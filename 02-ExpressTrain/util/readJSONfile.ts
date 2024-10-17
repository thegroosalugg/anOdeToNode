import fs from 'fs';

export default function readJSONFile<T>(filePath: string, callback: (data: T[]) => void) {
  // utf8 converts data Buffer to string format so it can be parsed
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
}
