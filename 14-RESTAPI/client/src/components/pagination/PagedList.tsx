import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paginated } from "./usePagedFetch";
import { custom } from "@/lib/hooks/usePages";
import { Align } from "@/lib/types/common";
import Friend from "@/models/Friend";
import ResizeDiv from "../ui/layout/ResizeDiv";
import PageButtons from "./PageButtons";
import Heading from "../ui/layout/Heading";
import css from "./PagedList.module.css";

type Config = {   text: string;    align?: Align  };
type Header = { title?: Config; fallback?: Config };

interface PagedList<T> extends Paginated<T> {
     className?: string;
         delay?: number;
          path?: string;
         header: Header;
  isFriendList?: boolean;
       children: (item: T) => React.ReactNode;
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
  const       classes = `no-scrollbar-x ${css["list"]} ${className}`;
  const       listRef = useRef<HTMLUListElement | null>(null);
  const        height = useRef<number | "auto">("auto");
  const shouldRecount = docCount < limit && items.length < limit;
  const        cursor = deferring ? "wait" : "";
  const       stagger = (index: number) => ({ duration: 0.5, delay: delay + 0.05 * index });
  const  align: Align = "start";
  const         title = { text: "",                 align, ...header.title    };
  const      fallback = { text: "No results found", align, ...header.fallback };

  // list fixes height by default to prevent layout shifts on pagination. .user-list (grid) opts out of this via CSS
  useLayoutEffect(() => {
    if (!listRef.current) return;

    height.current = shouldRecount ? "auto" : listRef.current.offsetHeight;
  }, [shouldRecount]);

  function navTo(item: T) {
    if (deferring || !path) return;
    const _id = isFriendList ? Friend.getId(item) : item._id;
    navigate(`/${path}/${_id}`);
  }

  return (
    <>
      <Heading
         className={`${css["list-header"]} ${hasItems ? css["title"] : ""}`}
             style={{ textAlign: hasItems && title ? title.align : fallback.align }}
        transition={{ delay }}
      >
        {hasItems ? title.text : `${fallback.text}...`}
      </Heading>
      {hasItems && (
        <>
        {/* .user-list use <ResizeDiv> to animate layout shifts on pagination. Default lists will not resize */}
          <ResizeDiv className={css["resize-container"]}>
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
          </ResizeDiv>
          {docCount > limit && <PageButtons {...{ docCount, limit, current, changePage, deferring, delay }} />}
        </>
      )}
    </>
  );
}
