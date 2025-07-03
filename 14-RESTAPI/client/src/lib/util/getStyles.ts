export function getStyles(str: string) {
  const [text, classes = ""] = str.split("@");

  const        py = classes.match(/py-(\d+)/)?.[1] ?? 4;
  console.log("PY", py)
  const     align = ["start", "center", "end"] as const;
  const textAlign = align.find((prop) => classes.includes(prop)) ?? "start";
  const     style = { textAlign, padding: `${py}px 1.5rem` };

  return { text, style };
}
