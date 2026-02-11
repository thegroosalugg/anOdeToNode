const createEndpoints = <T extends string>(prefix: T) => ({
   static: <K extends string>(endpoint: K) => `${prefix}/${endpoint}` as const,
  dynamic: <K extends string>(segment?: K) =>
    (id?: string) => id ? `${prefix}/${segment ? `${segment}/` : ""}${id}` as const : null
});

const feed    = createEndpoints("feed");
const post    = createEndpoints("post");
const profile = createEndpoints("profile");
const social  = createEndpoints("social");
const chat    = createEndpoints("chat");
const alerts  = createEndpoints("alerts");

export const api = {
  user: {
    refresh: ({ populate }: { populate?: boolean }) => `refresh-token${populate ? "?populate=true" : ""}`,     // * refresh-token?populate=true
      login: "login",                                                                                          // * login
     signup: "signup",                                                                                         // * signup
  },
  feed: {
     find: feed.dynamic("find"),                                                                               // * feed/find/:id
    posts: feed.static("posts"),                                                                               // * feed/posts
  },
  post: {
            new: post.static("new"),                                                                           // * post/new
           edit: post.dynamic("edit"),                                                                         // * post/edit/:id
         delete: post.dynamic("delete"),                                                                       // * post/delete/:id
        replies: post.dynamic("replies"),                                                                      // * post/replies/:id
          reply: post.dynamic("reply"),                                                                        // * post/reply/:id
    deleteReply: post.dynamic("delete-reply"),                                                                 // * post/delete-reply/:id
  },
  profile: {
      info: profile.static("info"),                                                                            // * profile/info
    setPic: profile.static("set-pic"),                                                                         // * profile/set-pic
     posts: profile.static("posts"),                                                                           // * profile/posts
  },
  social: {
        users: social.static("users"),                                                                         // * social/users
    userPosts: social.dynamic("posts"),                                                                        // * social/posts/:id
     findUser: social.dynamic("find"),                                                                         // * social/find/:id
      request: ({ id, action }: { id: string; action: "add" | "delete" | "accept" }) =>
      `${social.dynamic()(id)}/${action}`,                                                                     // * social/:id/:action
  },
  chat: {
         all: chat.static("all"),                                                                              // * chat/all
      delete: chat.static("delete"),                                                                           // * chat/delete
    messages: chat.dynamic("messages"),                                                                        // * chat/messages/:id
      newMsg: chat.dynamic("new-msg"),                                                                         // * chat/new-msg/:id
  },
  alerts: {
      clearMsgs: alerts.dynamic("chat"),                                                                       // * alerts/chat/:id
     readSocial: ({ query }: { query: "inbound" | "outbound" }) => `${alerts.static("social")}?type=${query}`, // * alerts/social?type=query
    readReplies: ({ read  }: { read?: boolean }) => `${alerts.static("replies")}${read ? "?read=true" : ""}`,  // * alerts/replies?read=true
    clearSocial: alerts.dynamic("social/hide"),                                                                // * alerts/social/hide/:id
     clearReply: alerts.dynamic("reply/hide"),                                                                 // * alerts/reply/hide/:id
  },
};
