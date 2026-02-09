import { motion, AnimatePresence } from "motion/react";
import { useRef, useLayoutEffect } from "react";
import { Paginated } from "./usePagedFetch";
import { custom } from "@/lib/motion/animations";
import { Align } from "@/lib/types/common";
import ResizeDiv from "../ui/layout/ResizeDiv";
import PageButtons from "./PageButtons";
import Heading from "../ui/layout/Heading";
import BouncingDots from "../ui/boundary/loader/BouncingDots";
import css from "./PagedList.module.css";

type Config = {   text: string;    align?: Align  };
type Header = { title?: Config; fallback?: Config };

interface PagedList<T> extends Paginated<T> {
  className?: string;
      header: Header;
    children: (item: T) => React.ReactNode;
}

export default function PagedList<T extends { _id: string }>({
     className = "",
        header,
          data: { docCount, items },
         limit,
   currentPage,
     direction,
    changePage,
     deferring,
      children,
}: PagedList<T>) {
  const      hasItems = !!items.length;
  const       classes = `no-scrollbar-x ${css["list"]} ${className}`;
  const       listRef = useRef<HTMLUListElement | null>(null);
  const        height = useRef<number | "auto">("auto");
  const shouldRecount = docCount < limit && items.length < limit;
  const pointerEvents = deferring ? "none" : "auto";
  const       stagger = (index: number) => ({ duration: 0.5, delay: 0.05 * index });
  const  align: Align = "start";
  const         title = { text: "",                 align, ...header.title    };
  const      fallback = { text: "No results found", align, ...header.fallback };

  // list fixes height by default to prevent layout shifts on pagination. .user-list (grid) opts out of this via CSS
  useLayoutEffect(() => {
    if (!listRef.current) return;

    height.current = shouldRecount ? "auto" : listRef.current.offsetHeight;
  }, [shouldRecount]);

  return (
    <>
      {hasItems ? (
        <Heading className={`${css["list-header"]} ${css["header-title"]}`} style={{ justifyContent: title.align }}>
          <span>{title.text}</span>
          <BouncingDots
              color="text"
               size={title.text ? 3 : 5} // bigger dots when no title text (replies list)
              // text ? remove default centering : restore centering, offset gap by self size
              style={{ margin: title.text ? 0 : "0 auto -5px" }}
            animate={{ opacity: deferring ? 1 : 0  }}
          />
        </Heading>
      ) : (
        <Heading className={css["list-header"]} style={{ textAlign: fallback.align }}>
          {fallback.text}...
        </Heading>
      )}
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
                         style={{ pointerEvents }}
                        custom={direction}
                      variants={{ ...custom }}
                    transition={{ x: stagger(i), opacity: stagger(i) }}
                  >
                    {children(item)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </ResizeDiv>
          {docCount > limit && <PageButtons {...{ docCount, limit, currentPage, changePage, deferring }} />}
        </>
      )}
    </>
  );
}
