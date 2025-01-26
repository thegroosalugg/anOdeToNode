type Friend = {
     status: 'sent' | 'received' | 'accepted';
       user: string; // reference ID only
  createdAt: string;
       read: boolean;
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
