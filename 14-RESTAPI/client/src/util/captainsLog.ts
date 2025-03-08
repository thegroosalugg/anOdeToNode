const getHSL = (hue: number) => `hsl(${hue % 360}, 50%, 50%)`;

export const captainsLog = (hue: number, data: unknown[]) => {
  const stack = new Error().stack?.split("\n")[2].match(/\/([^/]+)\.tsx?/i)?.[1] || 'Unknown';
  const  time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const style = `color: white; background: ${getHSL(hue)}; font-weight: bold;`;

  data.forEach((item) => {
    const type = Array.isArray(item) ? 'Array' : typeof item;
    if (typeof item === 'object' && item !== null) {
      console.groupCollapsed(`%c${type} [${time}] ▶️${stack}`, style);
      if (Array.isArray(item)) console.table(item);
      else                       console.dir(item);
      console.groupEnd();
    } else {
      console.log(`%c' ${item} [${time}] ▶️${stack}`, style);
    }
  });
};
