import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import Pagination, { PageHook, Paginated } from './Pagination';
import { LIST_CONFIG } from './PagedListConfig';
import css from './PagedList.module.css';

export type PagedConfig = 'reply' | 'profile' | 'feed' | 'users';

interface PagedList<T> extends Paginated<T, 'items'>, PageHook {
      type: PagedConfig;
  children: (item: T) => React.ReactNode;
}

export default function PagedList<T>({
     items,
      type,
     pages,
  setPages,
  docCount,
  children,
}: PagedList<T & { _id: string }>) {
  const { limit, setColor, listCss, navTo, delay, fallback } = LIST_CONFIG[type];
  const { deferring, deferFn } = useDebounce();
  const      navigate = useNavigate();
  const     direction = pages[0] < pages[1] ? 1 : -1;
  const             x = direction * 50;
  const    background = limit > items.length ? setColor : '#00000000';
  const      position = deferring ? 'sticky' : 'relative';
  const        cursor = deferring ?   'wait' : '';
  const       classes = [css['list'], ...listCss].filter(Boolean).join(' ');
  const       opacity = 0;
  const      duration = 0.5;
  const       listRef = useRef<HTMLUListElement |   null>(null);
  const        height = useRef<number           | 'auto'>('auto');
  const shouldRecount = docCount < limit && items.length < limit;

  useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        height.current = listRef.current.offsetHeight;
      }
      if (shouldRecount) height.current = 'auto';
    }, 1000);
  }, [shouldRecount]);

  function clickHandler(_id: string) {
    if (!deferring) {
      if (navTo) {
        navigate(`/${navTo}/${_id}`);
      } // may add else other callbacks later
    }
  }

  return (
    <>
      <motion.ul
              ref={listRef}
        className={classes}
            style={{ position, height: height.current }}
          initial={{ opacity }}
          animate={{
            background,
               opacity: 1,
            transition: {
                duration: 1,
                    ease: 'easeInOut',
                 opacity: { delay, duration: 1 }
              }
            }}
      >
        <AnimatePresence mode='popLayout'>
          {items.length > 0 ? (
            items.map((item, i) => (
              <motion.li
                 layout
                    key={item._id}
                onClick={() => clickHandler(item._id)}
                  style={{ cursor }}
                initial={{ opacity,    x }}
                animate={{ opacity: 1, x:  0, transition: { duration, delay: i * 0.1 } }}
                   exit={{ opacity,    x: -x, transition: { duration } }}
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
        <Pagination {...{ type, pages, setPages, docCount, deferring, deferFn }} />
      )}
    </>
  );
}
