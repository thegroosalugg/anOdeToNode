const getHSL = (hue: number) => {
  const isGrey = hue < 0;
  const h = isGrey ? 0 : hue % 360;
  const s = isGrey ? 0 : 50;
  const l = isGrey ? Math.min(Math.abs(hue), 100) : 50;
  return `hsl(${h}, ${s}%, ${l}%);`;
};

export const captainsLog = ([hue1, hue2]: [number, number], data: unknown[]) => {
  const stack = new Error().stack?.split("\n")[2].match(/\/([^/]+)\.tsx?/i)?.[1] || 'Unknown';
  const  time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const style = `color: ${getHSL(hue1)}; background: ${getHSL(hue2)}; font-weight: bold;`;

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
