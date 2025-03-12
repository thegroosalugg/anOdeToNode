import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paginated } from '@/hooks/usePagination';
import { LIST_CONFIG } from './pagedListConfig';
import Pagination from './Pagination';
import css from './PagedList.module.css';

export type PagedConfig = 'feed' | 'userPosts' |'reply' | 'users' | 'friends';

interface PagedList<T> extends Paginated<T> {
    config: PagedConfig;
  children: (item: T) => React.ReactNode;
}

export default function PagedList<T>({
      config,
        data: { docCount, items },
     current,
   direction,
  changePage,
   deferring,
    children,
     ...props
  // merge MotionProps while excluding any that conflict with PagedList's own prop types
}: PagedList<T & { _id: string }> & Omit<HTMLMotionProps<'li'>, keyof PagedList<T>>) {
  const { limit, setColor, listCss, navTo, delay, fallback } = LIST_CONFIG[config];
  const      navigate = useNavigate();
  const    background = limit > items.length ? setColor : '#00000000';
  const      position = deferring ? 'sticky' : 'relative';
  const        cursor = deferring ?   'wait' : '';
  const       classes = [css['list'], ...listCss].filter(Boolean).join(' ');
  const       opacity = 0;
  const      duration = 0.5;
  const       listRef = useRef<HTMLUListElement |   null>(null);
  const        height = useRef<number           | 'auto'>('auto');
  const shouldRecount = docCount < limit && items.length < limit;

  const ULvariants = {
     enter: { opacity },
    center: { opacity: 1, background },
      exit: { opacity },
  };

  const variants = {
     enter: (direction: number) => ({ opacity, x: direction > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
      exit: (direction: number) => ({ opacity, x: direction < 0 ? 50 : -50 }),
  };

  useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        height.current = listRef.current.offsetHeight;
      }
      if (shouldRecount) height.current = 'auto';
    }, 1000);
  }, [shouldRecount]);

  function clickHandler(_id: string) {
    if (!deferring && navTo) navigate(`/${navTo}/${_id}`);
  }

  return (
    <>
      <motion.ul
               ref={listRef}
         className={classes}
             style={{ position, height: height.current }}
          variants={ULvariants}
           initial='enter'
           animate='center'
              exit='exit'
        transition={{ duration: 1, ease: 'easeInOut', opacity: { delay, duration: 1 } }}
      >
        <AnimatePresence mode='popLayout' custom={direction}>
          {items.length > 0 ? (
            items.map((item, i) => (
              <motion.li
                  layout
                     key={item._id}
                 onClick={() => clickHandler(item._id)}
                   style={{ cursor }}
                  custom={direction}
                variants={variants}
                 initial='enter'
                 animate='center'
                    exit='exit'
              transition={{ duration, delay: 0.03 * i }}
                {...props}
              >
                {children(item)}
              </motion.li>
            ))
          ) : (
            <motion.p
                    key='fallback'
              className={css['fallback']}
                initial={{ opacity    }}
                animate={{ opacity: 1 }}
                   exit={{ opacity    }}
            >
              {fallback}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.ul>
      {docCount >= limit && (
        <Pagination {...{ config, current, changePage, docCount, deferring }} />
      )}
    </>
  );
}
