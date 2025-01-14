const coloredText = (n: number, text: string) =>
  text
    .split('\n')
    .map((line) => `\x1b[3${n}m${line}\x1b[0m`)
    .join('\n');

const captainsLog = (col: number, title: string, log: unknown = '') => {
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const content =
    typeof log === 'object' && log !== null
      ? JSON.stringify(log, null, 2) // Pretty-print with newlines
      : log;

  console.log(
    coloredText(col, `⇤⇥⇤⇥⇤⇥LOG⇤⇥{ ${title.toUpperCase()} ${time} ${content}}⇁↽END⇁↽`)
  );
};

export default captainsLog;
