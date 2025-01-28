import User from './User';

type Friend = {
        _id: string;
     status: 'sent' | 'received' | 'accepted';
       user: string | User;
  createdAt: string;
       meta: {
         read: boolean;
         show: boolean;
         init: string;
       };
};

export default Friend;
