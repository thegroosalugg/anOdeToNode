import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLMotionProps } from "motion/react";
import Button from "./Button";

export default function XButton({
     light,
  ...props
}: { light?: boolean } & HTMLMotionProps<"button">) {
  let background = "var(--text)";
  let      color = "var(--bg)";

  if (light) {
    background = "var(--bg)";
         color = "var(--fg)";
  }

  return (
    <Button aria-label="hide" {...{ background, color }} {...props}>
      <FontAwesomeIcon icon="x" />
    </Button>
  );
}
