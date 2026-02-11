import { HTMLMotionProps } from "motion/react";
import { Color } from "@/lib/types/colors";
import Spinner from "../boundary/loader/Spinner";
import Button from "./Button";

// Omit native <button> color: string | undefined so that wrapper can pass ...props like onClick without extra interface
interface SpinnerButton extends Omit<HTMLMotionProps<"button">, "color"> {
    isLoading: boolean;
  background?: Color;
     children: React.ReactNode;
}

export default function SpinnerButton({ isLoading, background, children, ...props }: SpinnerButton) {
  return (
    <Button disabled={isLoading} {...{ background }} {...props}>
      {isLoading ? <Spinner size={20} color="page" /> : children}
    </Button>
  );
}
