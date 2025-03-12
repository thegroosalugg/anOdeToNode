import   feedCss from '../post/PostItem.module.css';
import  replyCss from '../post/ReplyItem.module.css';
import socialCss from '../social/PeerItem.module.css';

export const LIST_CONFIG = {
  feed: {                           // each component calls only this key
        limit: 4,                   // docs per page. Matching no. must be set on Server
     setColor: 'var(--team-green)', // last list page && pagination color & border
        navTo: 'post',              // if list item should navigate to an ID page
        delay: 0.2,                 // enter animation. Cascades with other components
      listCss: [feedCss['feed']],   // override/extra UL styles. Default always applied
      pageCss: [],                  // same as above for Pagination
        chars: '…',                 // Pagination ellipsis
    setBckGrd: '#ebebeb',           // pagination button background color
     fallback: 'No posts yet.',     // when list is empty
  },

  userPosts: {
        limit: 6,
     setColor: 'var(--text-grey)',
        navTo: 'post',
        delay: 0,
      listCss: [feedCss['feed'], feedCss['isCreator']],
      pageCss: [feedCss['isCreator-pagination']],
        chars: '◈',
    setBckGrd: '#e1e1e1',
     fallback: "You haven't post anything",
  },

  reply: {
        limit: 8,
     setColor: '#777777',
        navTo: false,
        delay: 1.4,
      listCss: [replyCss['replies']],
      pageCss: [],
        chars: '▣',
    setBckGrd: '#ebebeb',
     fallback: 'No comments yet...',
  },

  users: {
        limit: 15,
     setColor: 'var(--team-green)',
        navTo: 'user',
        delay: 0.5,
      listCss: [socialCss['user-list']],
      pageCss: [],
        chars: '…',
    setBckGrd: '#eee',
     fallback: 'Nobody here...',
  },

  friends: {
        limit: 10,
     setColor: 'var(--text-grey)',
        navTo: 'user',
        delay: 0.5,
      listCss: [socialCss['user-list'], socialCss['friends-list']],
      pageCss: [socialCss['friends-pagination']],
        chars: '…',
    setBckGrd: '#eee',
     fallback: 'Your friends will display here',
  },

    mutual: {
        limit: 5,
     setColor: 'var(--team-green)',
        navTo: 'user',
        delay: 0.1,
      listCss: [socialCss['user-list'], socialCss['mutual-friends']],
      pageCss: [socialCss['friends-pagination']],
        chars: '…',
    setBckGrd: '#ebebeb',
     fallback: 'You have no mutual friends',
  },
};
