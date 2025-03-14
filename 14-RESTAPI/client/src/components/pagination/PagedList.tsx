import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paginated } from '@/hooks/usePagination';
import { LIST_CONFIG } from './pagedListConfig';
import Pagination from './Pagination';
import User from '@/models/User';
import css from './PagedList.module.css';

export type PagedConfig = 'feed' | 'userPosts' | 'reply' | 'users' | 'friends' | 'mutual';

interface PagedList<T> extends Paginated<T> {
    config: PagedConfig;
  children: (item: T) => React.ReactNode;
}

// user object will be nested when T is Friend, required for correct navTo functionality
type IDs = { _id: string, user?: User };

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
  // merge MotionProps while excluding any that conflict with PagedList's own prop types
}: PagedList<T & IDs> & Omit<HTMLMotionProps<'li'>, keyof PagedList<T>>) {
  const { setColor, listCss, navTo, delay, fallback } = LIST_CONFIG[config];
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
  const  isFriendList = ['friends', 'mutual'].includes(config);

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

  const stagger = (index: number) => ({ duration, delay: 0.03 * index });

  useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        height.current = listRef.current.offsetHeight;
      }
      if (shouldRecount) height.current = 'auto';
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
               ref={listRef}
         className={classes}
             style={{ position, height: height.current }}
          variants={ULvariants}
           initial='enter'
           animate='center'
              exit='exit'
        transition={{ duration: 1, ease: 'easeInOut', opacity: { delay, duration: 1 } }}
      >
        <AnimatePresence mode='popLayout' custom={direction} initial={!isFriendList}>
          {items.length > 0 ? (
            items.map((item, i) => (
              <motion.li
                    layout
                       key={item._id}
                   onClick={() => clickHandler(item)}
                     style={{ cursor }}
                    custom={direction}
                  variants={variants}
                   initial='enter'
                   animate='center'
                      exit='exit'
                transition={{ x: stagger(i), opacity: stagger(i) }}
                {...props} // target transitions so that whileHover etc. remain undisturbed
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
        <Pagination {...{ config, current, changePage, docCount, limit, deferring }} />
      )}
    </>
  );
}
