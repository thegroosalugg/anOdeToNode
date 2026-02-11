export type Routes = "/" | "/feed" | `/post/${string}` | "/social" | `/user/${string}` | "/about" | "/terms" | "/privacy";

export const ROUTES = {
     home: "/",
     feed: "/feed",
   postId: "/post/:postId",
   social: "/social",
   userId: "/user/:userId",
    about: "/about",
    terms: "/terms",
  privacy: "/privacy",
    error: "*",
   toPost: (id: string) => `/post/${id}` as const,
   toUser: (id: string) => `/user/${id}` as const,
   toChat: (id: string) => `?chat=${id}` as const,
} as const;
