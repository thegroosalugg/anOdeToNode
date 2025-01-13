import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Dispatch, SetStateAction } from 'react';
import css from './Pagination.module.css';

export type Pages = [previous: number, current: number];
// T: generic type (string/num/Model etc.)
// K: declares a dynamic key. Extends: declares key type. Named 'data' if undeclared
export type Paginated< T = null, K extends string = 'data' > = {
  docCount: number;
     limit: number;
     pages: Pages;
  setPages: Dispatch<SetStateAction<Pages>>;
} & {
  // combines fixed & dynamic Type. Dynamic types must be declared solo
  [key in K]: T[];
};

const Ellipsis = () => (
  <motion.span
        layout
       initial={{ opacity: 0, scale: 0 }}
       animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
    transition={{     duration: 1      }}
  >
    ...
  </motion.span>
);

export default function Pagination({
     limit,
  docCount,
     pages: [, current],
  setPages: setIsActive,
}: Omit<Paginated, 'data'>) {
  const     last = Math.ceil(docCount / limit);
  const   middle = last < 5 ? 3 : Math.min(Math.max(current, 3), last - 2);
  const    pages: number[] = [];

  if (last >= 1) pages.push(1);
  if (last >= 2) pages.push(middle - 1);
  if (last >= 3) pages.push(middle);
  if (last >= 4) pages.push(middle + 1);
  if (last >= 5) pages.push(last);

  return (
    <section className={css['pagination']}>
      <LayoutGroup>
        {pages.map((page) => {
          const isActive = current === page;
          return (
            <AnimatePresence key={page}>
              {last > 5 && page === last && pages[3] !== last - 1 && <Ellipsis key='e1' />}
              <motion.button
                  layout
                    key={page}
                onClick={() => setIsActive([current, page])}
             transition={{ opacity: { duration: 0.5, ease: 'linear' }}}
                initial={{ opacity: 0 }}
                animate={{
                      opacity: 1,
                   background: isActive ? '#a2c31f' : '#ededed',
                  borderColor: isActive ? '#000000' : 'var(--team-green)',
                        color: isActive ? '#000000' : 'var(--team-green)'
                }}
              >
                {page}
              </motion.button>
              {last > 5 && page === 1 && pages[1] !== 2 && <Ellipsis key='e2' />}
            </AnimatePresence>
          );
        })}
      </LayoutGroup>
    </section>
  );
}
