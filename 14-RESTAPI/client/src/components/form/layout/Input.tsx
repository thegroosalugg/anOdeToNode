import { motion, AnimatePresence, Variants } from "motion/react";
import { HTMLProps } from "react";
import { FetchError } from "@/lib/types/common";
import ErrorPopUp from "../../ui/boundary/error/ErrorPopUp";
import css from "./Input.module.css";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Input({
   control,
      rows,
    errors,
   confirm,
  variants,
  ...props
}: {
   control: string;
     rows?: number;
    errors: FetchError | null;
  confirm?: boolean;
 variants?: Variants;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const Element = rows ? "textarea" : "input";
  const name = confirm ? "confirm_" + control : control;
  const error = errors?.[control];
  const classes = `${css["control"]} ${error ? css["error"] : ""}`;
  let delay = 0.1 * (Object.keys(errors || {}).indexOf(control) + 1);
  if (confirm) delay += 0.1;

  return (
    <motion.div className={classes} {...{ variants }}>
      <label htmlFor={name}>{name.replaceAll("_", " ")}</label>
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
            error={capitalize(control) + " " + error}
            // framer scale animation prevents other transformations with CSS. Must set as style
            style={{ bottom: "-1.35rem", left: "50%", translate: "-50%" }}
            {...{ delay }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
