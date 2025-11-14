const coloredText = (n: number, text: string) => {
  const lines = text.split('\n');
  const  ANSI = (content: string) => `\x1b[3${n}m${content}\x1b[0m`;

  if (lines.length === 1) return ANSI(text);

  const barrier = '\n' + ANSI('⇎'.repeat(40));
  return lines.map((line) => ANSI(line)).join('\n') + barrier;
};

const errors = [TypeError, RangeError] as const;
const nonSerializable = (value: unknown): value is Error =>
  errors.some((err) => value instanceof err);

const formatText = (value: unknown) => {
  let content = '';
  if (nonSerializable(value)) {
    content = `<<${value.name}>> \n ${value.stack?.split('\n')[1].trim()}`;
  } else if (typeof value === 'object' && value !== null) {
    content = JSON.stringify(value, null, 1);
  } else {
    content = String(value);
  }
  return content;
};

const captainsLog = (status: number, title: string, log?: unknown[]) => {
  const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const color = {
    200: 2,       // green
    401: 6,       // cyan
    403: 1,       // red
    404: 4,       // blue
    422: 3,       // amber
  }[status] || 5; // magenta

  let content = '';
  if (log) content = log.map(item => formatText(item)).join('\n');

  console.log(coloredText(color, `${title.toUpperCase()} [${time}] ${content}`));
};

export default captainsLog;

