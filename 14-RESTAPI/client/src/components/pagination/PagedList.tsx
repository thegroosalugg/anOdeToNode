import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Paginated } from "./usePagedFetch";
import { custom } from "@/lib/hooks/usePages";
import { LIST_CONFIG } from "./pagedListConfig";
import PageButtons from "./PageButtons";
import User from "@/models/User";
import { createAnimations } from "@/lib/motion/animations";
import css from "./PagedList.module.css";

export type PagedConfig = "feed" | "userPosts" | "reply" | "users" | "friends" | "mutual";

interface PagedList<T> extends Paginated<T> {
    config: PagedConfig;
  children: (item: T) => React.ReactNode;
}

// user object will be nested when T is Friend, required for correct navTo functionality
type IDs = { _id: string; user?: User };

export default function PagedList<T>({
      config,
        data: { docCount, items },
       limit,
     current,
   direction,
  changePage,
   deferring,
    children,
    ...props
}: // merge MotionProps while excluding any that conflict with PagedList's own prop types
PagedList<T & IDs> & Omit<HTMLMotionProps<"li">, keyof PagedList<T>>) {
  const { listCss, navTo, delay, fallback } = LIST_CONFIG[config];
  const      navigate = useNavigate();
  const       classes = ["scrollbar-accent", css["list"], ...listCss].filter(Boolean).join(" ");
  const       listRef = useRef<HTMLUListElement | null>(null);
  const        height = useRef<number | "auto">("auto");
  const shouldRecount = docCount < limit && items.length < limit;
  const  isFriendList = ["friends", "mutual"].includes(config);
  const       opacity = 0;
  const      duration = 0.5;
  const        cursor = deferring ?   "wait" : "auto";
  const       stagger = (index: number) => ({ duration, delay: 0.05 * index });

  useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        height.current = listRef.current.offsetHeight;
      }
      if (shouldRecount) height.current = "auto";
    }, 1000);
  }, [shouldRecount]);

  function clickHandler(item: T & IDs) {
    if (!deferring && navTo) {
      const _id = isFriendList && item.user ? item.user._id : item._id;
      navigate(`/${navTo}/${_id}`);
    }
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
        <AnimatePresence mode="popLayout" custom={direction} initial={!isFriendList}>
          {items.length > 0 ? (
            items.map((item, i) => (
              <motion.li
                    layout
                   initial="enter"
                   animate="center"
                      exit="exit"
                       key={item._id}
                 className="floating-box"
                   onClick={() => clickHandler(item)}
                     style={{ cursor }}
                    custom={direction}
                  variants={{ ...custom }}
                transition={{ x: stagger(i), opacity: stagger(i) }}
                {...props} // target transitions so that whileHover etc. remain undisturbed
              >
                {children(item)}
              </motion.li>
            ))
          ) : (
            <motion.li
                    key="fallback"
              className={`floating-box ${css["fallback"]}`}
              {...createAnimations()}
            >
              {fallback}
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
      {docCount >= limit && (
        <PageButtons {...{ config, current, changePage, docCount, limit, deferring }} />
      )}
    </>
  );
}
