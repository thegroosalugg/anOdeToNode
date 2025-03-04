import { motion, LayoutGroup } from 'motion/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import type { Debounce } from '@/hooks/useDebounce';
import type { PagedConfig } from './PagedList';
import { LIST_CONFIG } from './pagedListConfig';
import css from './Pagination.module.css';

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

const Ellipsis = ({ chars, color }: { chars: string, color: string }) => (
  <motion.span
        layout
         style={{        color         }}
       initial={{ opacity: 0, scale: 0 }}
       animate={{ opacity: 1, scale: 1 }}
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
}: Omit<Paginated, 'data'> & { type: PagedConfig } & Debounce & PageHook) {
  const { limit, pageCss, delay } = LIST_CONFIG[type];
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

  const { chars, setColor, setBckGrd } = LIST_CONFIG[type];
  const  filter = `brightness(${deferring ? 0.9 : 1})`
  const classes = [css['pagination'], ...pageCss].filter(Boolean).join(' ');

  return (
    <motion.section
      className={classes}
        initial={{ opacity: 0 }} // 2nd component in line using this value, adds .5
        animate={{ opacity: 1, transition: { delay: delay + 0.5, duration: 0.8 } }}
    >
      <LayoutGroup>
        {pages.map((page) => {
          const    isActive = current === page;
          const       color =  isActive ? setBckGrd : setColor;
          const borderColor =  color;
          const  background = !isActive ? setBckGrd : setColor;
          return (
            <Fragment key={page}>
              {last > 5 && page === last && pages[3] !== last - 1 && (
                <Ellipsis {...{ chars, color }} />
              )}
              <motion.button
                    layout
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
                <Ellipsis {...{ chars, color }} />
              )}
            </Fragment>
          );
        })}
      </LayoutGroup>
    </motion.section>
  );
}
