const col = (n: number) => `\x1b[3${n}m`;
const end = '\x1b[0m';

const barrier = (s: string, n: number, clr: number) => col(clr) + s.repeat(n) + end;

const errorMsg = ({ where, error }: { where: string; error: any }) => {
  const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  console.log(
    `${barrier('⫨', 28, 5)} ${col(1)}<% ERROR %> ${where.toUpperCase()} ${time}${end}`
  );
  console.log(error)
  console.log(
    `${barrier('⫧', 28, 4)} ${col(2)}<% -END- %> ${where.toUpperCase()}${end}`
  );
};

export default errorMsg;
