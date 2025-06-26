import Friend from '@/models/Friend';
import { HSL } from '../ui/button/Button';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type ReqAction = 'add' | 'delete' | 'accept' | undefined; // if undefined function will return

export const getPeerConfig = (connection: Friend | undefined) => {
  const { initiated, accepted } = connection ?? {};

  let action: ReqAction = 'add';
  let text              = 'Add Friend';
  let icon:    IconProp = 'user-plus';
  let hsl:          HSL = [0, 0, 89];

  if (accepted) {
    action = undefined;
      text = 'Message';
      icon = 'comment';
       hsl = [200, 54, 35];
  } else if (initiated) {
    action = 'delete';
      text = 'Cancel';
      icon = 'rectangle-xmark';
       hsl = [10, 54, 51];
  } else if (connection && !initiated && !accepted) {
    action = 'accept';
      text = 'Accept';
      icon = 'check-to-slot';
       hsl = [102, 44, 40];
  }

  return { action, text, icon, hsl };
};
