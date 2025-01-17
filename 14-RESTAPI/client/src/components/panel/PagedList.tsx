import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Pagination, { Paginated } from '../pagination/Pagination';
import useDebounce from '@/hooks/useDebounce';
import css from './PagedList.module.css';

interface PagedList<T> extends Paginated<T, 'items'> {
  classNames: string[];
       color: string;
  itemHeight: number;
      navTo?: 'post';
    children: (item: T) => React.ReactNode;
}

export default function PagedList<T>({
       items,
       pages,
    setPages,
    docCount,
       limit,
  itemHeight,
       color,
  classNames,
       navTo,
    children,
}: PagedList<T & { _id: string }>) {
  const { deferring, deferFn } = useDebounce();
  const   navigate = useNavigate();
  const  direction = pages[0] < pages[1] ? 1 : -1;
  const          x = direction * 50;
  const background = limit > items.length ? color : '#00000000';
  const   position = deferring ? 'sticky' : 'relative';
  const     cursor = deferring ?   'wait' : '';
  let       height = itemHeight * limit + 'px';
  if (items.length <= 0) height = 'auto';

  const classes = [
    css['list'],
    ...classNames,
  ].filter(Boolean).join(' ');

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
        className={classes}
            style={{ height, position }}
          animate={{ background, transition: { duration: 1, ease: 'easeInOut' } }}
      >
        <AnimatePresence mode='popLayout'>
          {items.length > 0 ? (
            items.map((item, i) => (
              <motion.li
                 layout
                    key={item._id}
                onClick={() => clickHandler(item._id)}
                  style={{ cursor }}
                initial={{ opacity: 0, x }}
                animate={{ opacity: 1, x:  0, transition: { duration: 0.5, delay: i * 0.1 } }}
                   exit={{ opacity: 0, x: -x, transition: { duration: 0.5 } }}
              >
                {children(item)}
              </motion.li>
            ))
          ) : (
            <p className={css['fallback']}>Nothing to see here.</p>
          )}
        </AnimatePresence>
      </motion.ul>
      <Pagination {...{ classNames, pages, setPages, docCount, limit, deferring, deferFn }} />
    </>
  );
}
