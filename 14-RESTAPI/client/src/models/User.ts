import Friend from './Friend';

export type Profile = {
   home?: string;
   work?: string;
  study?: string;
    bio?: string;
}

type User = {
         _id: string;
        name: string;
     surname: string;
       email: string;
     imgURL?: string;
     friends: Friend[];
      about?: Profile;
   createdAt: string;
   JWTaccess: string;
  JWTrefresh: string;
};

export default User;
