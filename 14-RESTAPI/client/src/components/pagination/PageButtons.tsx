import { Fragment } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { Paginated } from './usePagedFetch';
import Button from '../ui/button/Button';
import css from './PageButtons.module.css';

const Ellipsis = () => (
  <motion.span
        layout
       initial={{ opacity: 0, scale: 0 }}
       animate={{ opacity: 1, scale: 1 }}
    transition={{     duration: 0.3    }}
  >
    …
  </motion.span>
);

export default function PageButtons({
     docCount,
        limit,
  currentPage,
   changePage,
    isLoading,
}: Omit<Paginated, 'data' | 'direction'> & { docCount: number }) {
  const   last = Math.ceil(docCount / limit);
  const middle = last < 5 ? 3 : Math.min(Math.max(currentPage, 3), last - 2);
  const  pages: number[] = [];

  if (last >= 1) pages.push(1);
  if (last >= 2) pages.push(middle - 1);
  if (last >= 3) pages.push(middle);
  if (last >= 4) pages.push(middle + 1);
  if (last >= 5) pages.push(last);

  return (
    <motion.div
      className={`${css['page-buttons']} no-scrollbar-x`}
        initial={{ opacity: 0 }} // 2nd component in line using this value, adds .5
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
    >
      <LayoutGroup>
        {pages.map((page) => {
          const [accent, bg] = ["accent", "page-alt"] as const;
          const     isActive = currentPage === page;
          const        color =  isActive ? bg : accent;
          const   background = !isActive ? bg : accent;
          const       border =  color;
          return (
            <Fragment key={page}>
              {last > 5 && page === last && pages[3] !== last - 1 && <Ellipsis />}
              <Button
                     layout
                   disabled={isLoading}
                data-active={isActive}
                    onClick={() => changePage(page)}
                {...{ background, border, color }}
              >
                {page}
              </Button>
              {last > 5 && page === 1 && pages[1] !== 2 && <Ellipsis />}
            </Fragment>
          );
        })}
      </LayoutGroup>
    </motion.div>
  );
}
