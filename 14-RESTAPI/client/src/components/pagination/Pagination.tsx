import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Dispatch, SetStateAction } from 'react';
import type { Debounce } from '@/hooks/useDebounce';
import css from './Pagination.module.css'; // must be imported before config for overrides to work
import { config } from '../panel/PagedListConfig'; // must be imported after modules here

export type Pages = [previous: number, current: number];

export type PageHook = {
     pages: Pages;
  setPages: Dispatch<SetStateAction<Pages>>;
}
// T: generic type (string/num/Model etc.)
// K: declares a dynamic key. Extends: declares key type. Named 'data' if undeclared
export type Paginated< T = null, K extends string = 'data' > = {
  docCount: number;
} & {
  // combines fixed & dynamic Type. Dynamic types must be declared solo
  [key in K]: T[];
};

const Ellipsis = ({ chars }: { chars: string }) => (
  <motion.span
        layout
       initial={{ opacity: 0, scale: 0 }}
       animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
    transition={{     duration: 0.3    }}
  >
    {chars}
  </motion.span>
);

export default function Pagination({
      type,
  docCount,
     pages: [, current],
  setPages: setIsActive,
 deferring,
   deferFn,
}: Omit<Paginated, 'data'> & { type: keyof typeof config } & Debounce & PageHook) {
  const { limit, pageCss } = config[type];
  const     last = Math.ceil(docCount / limit);
  const   middle = last < 5 ? 3 : Math.min(Math.max(current, 3), last - 2);
  const    pages: number[] = [];

  if (last >= 1) pages.push(1);
  if (last >= 2) pages.push(middle - 1);
  if (last >= 3) pages.push(middle);
  if (last >= 4) pages.push(middle + 1);
  if (last >= 5) pages.push(last);

  const changePage = (page: number) => {
    deferFn(() => setIsActive([current, page]), 1200);
  }

  const { chars, color: setColor, background: setBckGrd } = config[type];
  const  filter = `brightness(${deferring ? 0.9 : 1})`
  const classes = [css['pagination'], ...pageCss].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      <LayoutGroup>
        {pages.map((page) => {
          const    isActive = current === page;
          const       color =  isActive ? setBckGrd : setColor;
          const borderColor =  color;
          const  background = !isActive ? setBckGrd : setColor;
          return (
            <AnimatePresence key={page}>
              {last > 5 && page === last && pages[3] !== last - 1 && (
                <Ellipsis key='e1' chars={chars} />
              )}
              <motion.button
                     layout
                       key={page}
                  disabled={deferring}
                   onClick={() => changePage(page)}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, background, borderColor, color, filter }}
                transition={{
                  opacity: { duration: 0.5, ease: 'linear' },
                   layout: { duration: 0.3 },
                }}
              >
                {page}
              </motion.button>
              {last > 5 && page === 1 && pages[1] !== 2 && (
                <Ellipsis key='e2' chars={chars} />
              )}
            </AnimatePresence>
          );
        })}
      </LayoutGroup>
    </section>
  );
}
