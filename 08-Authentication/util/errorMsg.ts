const col = (n: number) => `\x1b[3${n}m`;
const end = '\x1b[0m';

const barrier = (s: string, n: number, noLog?: boolean) => {
  const chars = col(5) + s.repeat(n) + end;
  if (noLog) return chars;
  console.log(chars);
};

const errorMsg = ({ where, error }: { where: string; error: any }) => {
  barrier('⇄', 84);
  console.log(
    `${barrier('⫨', 28, true)} ${col(1)}<% ERROR %> ${where.toUpperCase()}${end}`
  );
  console.log(error)
  console.log(
    `${barrier('⫧', 28, true)} ${col(2)}<% -END- %> ${where.toUpperCase()}${end}`
  );
  barrier('⇏⇎', 42);
};

export default errorMsg;
