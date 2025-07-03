import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Paginated } from "./usePagedFetch";
import { custom } from "@/lib/hooks/usePages";
import Friend from "@/models/Friend";
import PageButtons from "./PageButtons";
import { createAnimations } from "@/lib/motion/animations";
import { getStyles } from "../../lib/util/getStyles";
import css from "./PagedList.module.css";

interface PagedList<T> extends Paginated<T> {
     className?: string;
         delay?: number;
          path?: string;
      fallback?: string;
  isFriendList?: boolean;
       children: (item: T) => ReactNode;
}

export default function PagedList<T extends { _id: string }>({
     className = "",
         delay = 0,
          path,
      fallback = "No results found",
  isFriendList,
          data: { docCount, items },
         limit,
       current,
     direction,
    changePage,
     deferring,
      children,
      ...props
}: // merges PagedList & <motion.li> props; excluding common duplicates: [key, children, ...etc]
PagedList<T> & Omit<HTMLMotionProps<"li">, keyof PagedList<T>>) {
  const      navigate = useNavigate();
  const       classes = `scrollbar-accent" ${css["list"]} ${className}`;
  const       listRef = useRef<HTMLUListElement | null>(null);
  const        height = useRef<number | "auto">("auto");
  const shouldRecount = docCount < limit && items.length < limit;
  const       opacity = 0;
  const      duration = 0.5;
  const        cursor = deferring ? "wait" : "";
  const       stagger = (index: number) => ({ duration, delay: 0.05 * index });
  const { text, style } = getStyles(fallback);

  useEffect(() => {
    setTimeout(() => {
      if (listRef.current) height.current = listRef.current.offsetHeight;
      if ( shouldRecount ) height.current = "auto";
    }, 1000);
  }, [shouldRecount]);

  function navTo(item: T) {
    if (deferring || !path) return;
    const _id = isFriendList ? Friend.getId(item) : item._id;
    navigate(`/${path}/${_id}`);
  }

  return (
    <>
      <motion.ul
          initial="enter"
          animate="center"
             exit="exit"
              ref={listRef}
        className={classes}
            style={{ height: height.current }}
         variants={{
            enter: { opacity    },
           center: { opacity: 1 },
             exit: { opacity    },
         }}
        transition={{ duration, ease: "easeInOut", opacity: { delay } }}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          {items.length ? (
            items.map((item, i) => (
              <motion.li
                    layout
                   initial="enter"
                   animate="center"
                      exit="exit"
                       key={item._id}
                 className="floating-box"
                   onClick={() => navTo(item)}
                     style={{ cursor }}
                    custom={direction}
                  variants={{ ...custom }}
                transition={{ x: stagger(i), opacity: stagger(i) }}
                {...props}
              >
                {children(item)}
              </motion.li>
            ))
          ) : (
            <motion.li
                    key="fallback"
              className={`floating-box ${css["fallback"]}`}
              {...createAnimations()}
              {...{ style }} // padding: py-value px-1.5rem; text-align: value;
            >
              {text}...
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
      {docCount > limit && (
        <PageButtons {...{ docCount, limit, current, changePage, deferring, delay }} />
      )}
    </>
  );
}
