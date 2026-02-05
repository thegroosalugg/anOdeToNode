import { motion, AnimatePresence, Variants } from "motion/react";
import { HTMLProps, ReactNode } from "react";
import { ApiError } from "@/lib/http/fetchData";
import ErrorPopUp from "../../ui/boundary/error/ErrorPopUp";
import css from "./Input.module.css";

export default function Input({
   control,
      rows,
    errors,
   confirm,
  variants,
  children,
  ...props
}: {
    control: string;
      rows?: number;
     errors: ApiError | null;
   confirm?: boolean;
  variants?: Variants;
   children: ReactNode;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const Element = rows ? "textarea" : "input";
  const name = confirm ? "confirm_" + control : control;
  const error = errors?.[control];
  const classes = `${css["control"]} ${error ? css["error"] : ""}`;
  let delay = 0.1 * (Object.keys(errors || {}).indexOf(control) + 1);
  if (confirm) delay += 0.1;

  return (
    <motion.div className={classes} {...{ variants }}>
      <label htmlFor={name}>{children}</label>
      <Element
               id={name}
             name={name}
        className="floating-box"
        {...(control === "password" && { type: "password" })} // does not add Type to textarea
        {...(rows && { rows })}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <ErrorPopUp
            {...{ error, delay }}
            // framer scale animation prevents other transformations with CSS. Must set as style
            style={{ bottom: "-1.35rem", left: "50%", translate: "-50%" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
