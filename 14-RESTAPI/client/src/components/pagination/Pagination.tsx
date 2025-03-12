import { Fragment } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { Paginated } from '@/hooks/usePagination';
import { LIST_CONFIG } from './pagedListConfig';
import { PagedConfig } from './PagedList';
import css from './Pagination.module.css';

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
       config,
     docCount,
      current,
   changePage,
    deferring,
}: Omit<Paginated, 'data' | 'direction'> & { config: PagedConfig, docCount: number }) {
  const { limit, pageCss, delay } = LIST_CONFIG[config];
  const     last = Math.ceil(docCount / limit);
  const   middle = last < 5 ? 3 : Math.min(Math.max(current, 3), last - 2);
  const    pages: number[] = [];

  if (last >= 1) pages.push(1);
  if (last >= 2) pages.push(middle - 1);
  if (last >= 3) pages.push(middle);
  if (last >= 4) pages.push(middle + 1);
  if (last >= 5) pages.push(last);

  const { chars, setColor, setBckGrd } = LIST_CONFIG[config];
  const  filter = `brightness(${deferring ? 0.9 : 1})`
  const classes = [css['pagination'], ...pageCss].filter(Boolean).join(' ');

  return (
    <motion.section
      className={classes}
        initial={{ opacity: 0 }} // 2nd component in line using this value, adds .5
        animate={{ opacity: 1, transition: { delay: delay + 0.5, duration: 0.5 } }}
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
