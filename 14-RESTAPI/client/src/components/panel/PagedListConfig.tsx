import feedCss from '../post/PostItem.module.css';

export const config = {
  feed: {
     height: '560px',
      limit: 4,
      color: 'var(--team-green)',
      navTo: 'post',
    classes: [feedCss.feed],
  },

  user: {
     height: '360px',
      limit: 6,
      color: '#454545',
      navTo: 'post',
    classes: [feedCss.feed, feedCss['on-user-page']],
  },

  reply: {
     height: '',
      limit: 0,
      color: '',
      navTo: false,
    classes: [],
  },
};
