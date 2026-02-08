import { AnimatePresence } from "motion/react";
import { Fragment } from "react/jsx-runtime";
import { ReactNode } from "react";
import { ApiError } from "@/lib/http/fetchData";
import Error from "./error/Error";
import Spinner from "./loader/Spinner";

interface AsyncAwait {
  isLoading: boolean;
     error?: ApiError | null;
   children: ReactNode;
}

export default function AsyncAwait({ isLoading, error, children }: AsyncAwait) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Spinner key="spinner" />
      ) : error ? (
        <Error key="error" {...{ error }} />
      ) : (
        <Fragment key="children">{children}</Fragment>
      )}
    </AnimatePresence>
  );
}
