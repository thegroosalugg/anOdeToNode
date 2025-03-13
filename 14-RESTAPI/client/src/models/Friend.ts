import User from './User';

type Friend = {
         _id: string;
   createdAt: string;
  acceptedAt: string;
    accepted: boolean;
   initiated: boolean;
        user: User;
        meta: { read: boolean; show: boolean };
};

export default Friend;
