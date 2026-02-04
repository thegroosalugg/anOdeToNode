let hour, minute, second;
hour = minute = second = '2-digit' as const;

const getTime = () => new Date().toLocaleTimeString([], { hour, minute, second, hour12: false });

// (38|48) = (fore|back)ground; (2|5) = (R;G;B;|256)colorMode; 0-255 = color
const ANSIstr = (n: number) => `\x1b[38;5;${n}m`;

// \new lines must be wrapped per line with ANSI escape codes
const toColor = (n: number, text: string) =>
  text
    .split('\n')
    .map((line) => ANSIstr(n) + line)
    .join('\n');

const publish = (value: unknown) => {
  if (value instanceof Error) {
    const { name = '', message = '', stack = '' } = value;
    const frame = stack.split('\n')[1]?.trim() ?? ''; // 1st stack frame: line where error occured
    return `${name}\n${message}\n${frame}`;
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 1);
  }

  return String(value);
};

const getColor = (status: number) => {
  if (status >= 200 && status < 300) return 46;  // green
  if (status >= 400 && status < 500) return 208; // orange
  if (status >= 500)                 return 196; // red
  return 135; // violet
};

const logger = (status: number, payload: object) => {
  const color = getColor(status);
  const log = (text: string) => console.log(toColor(color, text));
  log(`\n[${getTime()}]`);

  for (const [key, value] of Object.entries(payload)) {
    const message = publish(value);
    log(` ${key}::: ${message}`);
  }
};

export default logger;
