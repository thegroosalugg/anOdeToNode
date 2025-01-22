import   feedCss from '../post/PostItem.module.css';
import  replyCss from '../post/ReplyItem.module.css';
import socialCss from '../social/UserItem.module.css';

export const LIST_CONFIG = {
  feed: {                           // each component calls only this key
        limit: 4,                   // docs per page. Matching no. must be set on Server
     setColor: 'var(--team-green)', // last list page && pagination color & border
        navTo: 'post',              // if list item should navigate to an ID page
        delay: 1,                   // enter animation. Cascades with other components
      listCss: [feedCss.feed],      // override/extra UL styles. Default always applied
      pageCss: [],                  // same as above for Pagination
        chars: '…',                 // Pagination ellipsis
    setBckGrd: '#ebebeb',           // pagination button background color
     fallback: 'No posts yet.',     // when list is empty
  },

  profile: {
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
        limit: 8,
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
        limit: 15,
     setColor: 'var(--team-green)',
        navTo: 'user',
        delay: 0.5,
      listCss: [socialCss.community],
      pageCss: [],
        chars: '⇎',
    setBckGrd: '#eee',
     fallback: 'Nobody here...',
  },
};
