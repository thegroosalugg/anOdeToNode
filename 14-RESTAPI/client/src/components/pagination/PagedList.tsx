import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Paginated } from "./usePagedFetch";
import { custom } from "@/lib/hooks/usePages";
import { Align } from "@/lib/types/common";
import Friend from "@/models/Friend";
import PageButtons from "./PageButtons";
import Heading from "../ui/layout/Heading";
import css from "./PagedList.module.css";

type Config = [string, Align?];
type Header = { title?: Config; fallback?: Config };

interface PagedList<T> extends Paginated<T> {
     className?: string;
         delay?: number;
          path?: string;
        header?: Header;
  isFriendList?: boolean;
       children: (item: T) => ReactNode;
}

export default function PagedList<T extends { _id: string }>({
     className = "",
         delay = 0,
          path,
        header,
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
  const      hasItems = items.length > 0;
  const       classes = `scrollbar-accent ${css["list"]} ${className}`;
  const       listRef = useRef<HTMLUListElement | null>(null);
  const        height = useRef<number | "auto">("auto");
  const shouldRecount = docCount < limit && items.length < limit;
  const        cursor = deferring ? "wait" : "";
  const       stagger = (index: number) => ({ duration: 0.5, delay: delay + 0.05 * index });
  const { title = ["", "start"], fallback = ["No results found", "start"] } = header ?? {};

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
      <Heading
        className={`${css["header"]} ${hasItems ? css["title"] : ""}`}
            style={{ textAlign: hasItems && title ? title[1] : fallback[1] }}
       transition={{ delay }}
      >
        {hasItems ? title[0] : `${fallback[0]}...`}
      </Heading>
      {hasItems && (
        <>
          <motion.ul
              initial="enter"
              animate="center"
                 exit="exit"
                  ref={listRef}
            className={classes}
                style={{ height: height.current }}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {items.map((item, i) => (
                <motion.li
                      layout
                     initial="enter"
                     animate="center"
                        exit="exit"
                         key={item._id}
                     onClick={() => navTo(item)}
                       style={{ cursor }}
                      custom={direction}
                    variants={{ ...custom }}
                  transition={{ x: stagger(i), opacity: stagger(i) }}
                  {...props}
                >
                  {children(item)}
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {docCount > limit && (
            <PageButtons {...{ docCount, limit, current, changePage, deferring, delay }} />
          )}
        </>
      )}
    </>
  );
}
