import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLMotionProps } from "motion/react";
import Button from "./Button";

export default function XButton({
     light,
  ...props
}: { light?: boolean } & HTMLMotionProps<"button">) {
  const [background, color] = light ? (["page", "text-alt"] as const) : (["text-alt", "page"] as const);
  const border = color;

  return (
    <Button aria-label="close button" {...props} {...{ background, color, border }}>
      <FontAwesomeIcon icon="x" />
    </Button>
  );
}
