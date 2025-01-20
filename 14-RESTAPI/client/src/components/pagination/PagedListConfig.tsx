import   feedCss from '../post/PostItem.module.css';
import  replyCss from '../post/ReplyItem.module.css';
import socialCss from '../social/UserItem.module.css';

export const LIST_CONFIG = {
  feed: {
       height: '560px',
        limit: 4,
     setColor: 'var(--team-green)',
        navTo: 'post',
        delay: 1,
      listCss: [feedCss.feed],
      pageCss: [],
        chars: '…',
    setBckGrd: '#ebebeb',
     fallback: 'No posts yet.',
  },

  profile: {
       height: '360px',
        limit: 6,
     setColor: '#454545',
        navTo: 'post',
        delay: 0.8,
      listCss: [feedCss.feed, feedCss['on-user-page']],
      pageCss: [feedCss['on-user-pagination']],
        chars: '◈',
    setBckGrd: '#e1e1e1',
     fallback: "You haven't post anything",
  },

  reply: {
       height: '450px',
        limit: 10,
     setColor: '#777777',
        navTo: false,
        delay: 1.5,
      listCss: [replyCss.replies],
      pageCss: [],
        chars: '◻',
    setBckGrd: '#ebebeb',
     fallback: 'No comments yet...',
  },

  users: {
       height: '',
        limit: 15,
     setColor: 'var(--team-green)',
        navTo: false,
        delay: 0.5,
      listCss: [socialCss.community],
      pageCss: [],
        chars: '⇎',
    setBckGrd: '#eee',
     fallback: 'Nobody here...',
  },
};
