import { AnimatePresence } from "motion/react";
import { Fragment } from "react/jsx-runtime";
import { ReactNode, useEffect, useState } from "react";
import { ApiError } from "@/lib/http/fetchData";
import Error from "./error/Error";
import Spinner from "./loader/Spinner";
import Modal from "../modal/Modal";
import BouncingDots from "./loader/BouncingDots";
import ResizeDiv from "../layout/ResizeDiv";
import { createAnimations } from "@/lib/motion/animations";

interface AsyncAwait {
   isInitial: boolean;
  isLoading?: boolean;
      error?: ApiError | null;
    children: ReactNode;
}

const animations = createAnimations();

export default function AsyncAwait({ isInitial, isLoading, error, children }: AsyncAwait) {
  const [showModal, setShowModal] = useState(false);
  const showLoader = isLoading && !isInitial;

  useEffect(() => {
    if (error?.message) setShowModal(true);
  }, [error]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isInitial ? <Spinner key="spinner" /> : <Fragment key="children">{children}</Fragment>}
      </AnimatePresence>
      <Modal open={showModal} close={() => setShowModal(false)}>
        <Error {...{ error }} style={{ width: "100%", maxWidth: 250, padding: "var(--padding-lg)" }} />
      </Modal>
      <ResizeDiv>
        <AnimatePresence>
          {showLoader && <BouncingDots {...animations} />}
        </AnimatePresence>
      </ResizeDiv>
    </>
  );
}
