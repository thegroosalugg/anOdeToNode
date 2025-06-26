import { motion, AnimatePresence, Variants } from "motion/react";
import { HTMLProps } from "react";
import { FetchError } from "@/util/fetchData";
import ErrorPopUp from "../error/ErrorPopUp";
import css from "./Input.module.css";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function Input({
        id,
      text,
    errors,
   confirm,
  variants,
  ...props
}: {
         id: string;
      text?: boolean;
     errors: FetchError | null;
   confirm?: boolean;
  variants?: Variants;
} & (HTMLProps<HTMLInputElement> & HTMLProps<HTMLTextAreaElement>)) {
  const     Element =    text ? "textarea" : "input";
  const        name = confirm ? "confirm_" + id : id;
  const       error = errors?.[id];
  const     classes = `${css["input"]} ${error ? css["error"] : ""}`;
  let delay = 0.1 * (Object.keys(errors || {}).indexOf(id) + 1);
  if (confirm) delay += 0.1;

  return (
    <motion.div className={classes} {...{ variants }}>
      <label htmlFor={name}>
        {name.replaceAll("_", " ")}
      </label>
      <Element
           id={name}
         name={name}
        {...(id === "password" && { type: "password" })} // does not add Type to textarea
        {...props}
      />
      <AnimatePresence>
        {error && (
          <ErrorPopUp
           {...{ delay }}
            error={capitalize(id) + " " + error}
            style={{ bottom: "-1.3rem", left: "50%", translate: "-50%" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
