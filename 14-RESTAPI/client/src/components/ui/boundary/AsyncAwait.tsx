import { AnimatePresence } from "motion/react";
import { Fragment } from "react/jsx-runtime";
import { ReactNode } from "react";
import { FetchError } from "@/lib/types/common";
import Error from "./error/Error";
import Loader from "./loader/Loader";

interface AsyncAwait {
  isLoading: boolean;
     error?: FetchError | null;
   children: ReactNode;
}

export default function AsyncAwait({ isLoading, error, children }: AsyncAwait) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Loader key="loader" />
      ) : error ? (
        <Error key="error" {...{ error }} />
      ) : (
        <Fragment key="children">{children}</Fragment>
      )}
    </AnimatePresence>
  );
}
