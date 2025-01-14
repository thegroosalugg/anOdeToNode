const log = '▫▪⇝↠↮↭LOG⇁↽{ '
const end = '▫▪⇁↽END⇁↽'

const coloredText = (n: number, text: string) => {
  const lines = text.split('\n');
  const ANSI1 = `\x1b[3${n}m`;
  const ANSI2 = '\x1b[0m';

  if (lines.length === 1) {
    return ANSI1 + log + text + end + ANSI2;
  }

  return lines
    .map((line, i) => {
      if (i ===                0) return ANSI1 +  log + line + ANSI2;
      if (i === lines.length - 1) return ANSI1 + line +  end + ANSI2;
      return ANSI1 + line + ANSI2;
    })
    .join('\n');
};

const captainsLog = (col: number, title: string, log: unknown = '') => {
  const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const content =
    typeof log === 'object' && log !== null
      ? JSON.stringify(log, null, 2)
      : log;

  console.log(
    coloredText(col, `${title.toUpperCase()} ${time} ${content}`)
  );
};

export default captainsLog;
