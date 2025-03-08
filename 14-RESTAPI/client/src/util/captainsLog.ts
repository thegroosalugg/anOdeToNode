const getHSL = (hue: number) => `hsl(${hue % 360}, 50%, 50%)`;

export const captainsLog = (hue: number, data: unknown[]) => {
  const style = `color: white; background: ${getHSL(hue)}; font-weight: bold;`;
  const stack = new Error().stack?.split("\n") || [];

  const rootComponent = stack
    .map((line) => line.match(/\/([^/]+)\.tsx?/i)?.[1]) // Extract file names
    .filter(Boolean) // Remove null values
    .pop() || 'Unknown'; // Get the earliest component in the stack

  const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  data.forEach((item) => {
    const type = Array.isArray(item) ? 'Array' : typeof item;
    if (typeof item === 'object' && item !== null) {
      console.groupCollapsed(`%c${type}`, style);
      if (Array.isArray(item)) console.table(item);
      else                       console.dir(item);
      console.groupEnd();
    } else {
      console.log(`%c${item}\n[${time}, ${rootComponent}]`, style);
    }
  });
};
