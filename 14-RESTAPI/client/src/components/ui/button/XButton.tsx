import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLMotionProps } from "motion/react";
import Button from "./Button";

export default function XButton({
     light,
  ...props
}: { light?: boolean } & HTMLMotionProps<"button">) {
  let background = "var(--text-alt)";
  let      color = "var(--page)";

  if (light) {
    background = "var(--page)";
         color = "var(--text)";
  }

  return (
    <Button aria-label="hide" {...{ background, color }} {...props}>
      <FontAwesomeIcon icon="x" />
    </Button>
  );
}
