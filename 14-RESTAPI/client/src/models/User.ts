export const getId = (user: User | string) =>
  typeof user === 'object' && '_id' in user ? user._id : user;

type Friend = {
     status: 'sent' | 'received' | 'accepted';
       user: string | User;
  createdAt: string;
       meta: {
         read: boolean;
         show: boolean;
       };
};

type User = {
         _id: string;
        name: string;
     surname: string;
       email: string;
     imgURL?: string;
     friends: Friend[];
   createdAt: string;
   JWTaccess: string;
  JWTrefresh: string;
};

export default User;
