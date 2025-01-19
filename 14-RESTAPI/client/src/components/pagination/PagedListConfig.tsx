import feedCss from '../post/PostItem.module.css';
import replyCss from '../post/ReplyItem.module.css';

export const LIST_CONFIG = {
  feed: {
        height: '560px',
         limit: 4,
         color: 'var(--team-green)',
         navTo: 'post',
         delay: 1,
       listCss: [feedCss.feed],
       pageCss: [],
         chars: '…',
    background: '#ebebeb',
      fallback: 'No posts yet.',
  },

  user: {
        height: '360px',
         limit: 6,
         color: '#454545',
         navTo: 'post',
         delay: 0.8,
       listCss: [feedCss.feed, feedCss['on-user-page']],
       pageCss: [feedCss['on-user-pagination']],
         chars: '◈',
    background: '#e1e1e1',
      fallback: "You haven't post anything",
  },

  reply: {
        height: '450px',
         limit: 10,
         color: '#777777',
         navTo: false,
         delay: 1.5,
       listCss: [replyCss.replies],
       pageCss: [],
         chars: '◻',
    background: '#ebebeb',
      fallback: 'No comments yet...',
  },
};
