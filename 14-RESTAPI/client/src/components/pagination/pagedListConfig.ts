import   feedCss from '../post/PostItem.module.css';
import  replyCss from '../post/ReplyItem.module.css';

export const LIST_CONFIG = {
  feed: {                           // each component calls only this key
        navTo: 'post',              // if list item should navigate to an ID page
        delay: 0.2,                 // enter animation. Cascades with other components
      listCss: [feedCss['feed']],   // override/extra UL styles. Default always applied
     fallback: 'No posts yet.',     // when list is empty
  },

  userPosts: {
        navTo: 'post',
        delay: 0,
      listCss: [feedCss['feed'], feedCss['isCreator']],
     fallback: "You haven't post anything",
  },

  reply: {
        navTo: false,
        delay: 1.4,
      listCss: [replyCss['replies']],
     fallback: 'No comments yet...',
  },

};
