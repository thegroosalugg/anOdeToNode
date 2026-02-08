import { Color } from "@/lib/types/colors";
import css from "./BouncingDots.module.css";

export default function BouncingDots({ color = "accent", size = 15 }: { color?: Color; size?: number }) {
  return (
    <div
      className={css["bouncing-dots"]}
          style={{ "--background": `var(--${color})`, "--size": `${size}px` } as React.CSSProperties}
    >
      <div />
      <div />
      <div />
    </div>
  );
}
