import User from './User';

type Friend = {
        _id: string;
   accepted: boolean;
  initiated: boolean;
       user: string | User;
  createdAt: string;
       meta: { read: boolean; show: boolean };
};

export default Friend;
