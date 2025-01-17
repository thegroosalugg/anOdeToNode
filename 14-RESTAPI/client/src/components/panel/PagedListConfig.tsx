import feedCss from '../post/PostItem.module.css';

export const config = {
  feed: {
        height: '560px',
         limit: 4,
         color: 'var(--team-green)',
         navTo: 'post',
       listCss: [feedCss.feed],
       pageCss: [],
         chars: '…',
    background: '#ebebeb',
  },

  user: {
        height: '360px',
         limit: 6,
         color: '#454545',
         navTo: 'post',
       listCss: [feedCss.feed, feedCss['on-user-page']],
       pageCss: [feedCss['on-user-pagination']],
         chars: '◈',
    background: '#e1e1e1',


  },

  reply: {
        height: '',
         limit: 0,
         color: '',
         navTo: false,
       listCss: [],
       pageCss: [],
         chars: '…',
    background: '#ebebeb',
  },
};
