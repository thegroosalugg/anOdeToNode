import Friend from '@/models/Friend';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type ReqAction = 'add' | 'delete' | 'accept' | undefined; // if undefined function will return

export const getPeerConfig = (connection: Friend | undefined) => {
  const { initiated, accepted } = connection ?? {};

  let action: ReqAction = 'add';
  let text              = 'Add Friend';
  let icon:    IconProp = 'user-plus';

  if (accepted) {
    action = undefined;
      text = 'Message';
      icon = 'comment';
  } else if (initiated) {
    action = 'delete';
      text = 'Cancel';
      icon = 'rectangle-xmark';
  } else if (connection && !initiated && !accepted) {
    action = 'accept';
      text = 'Accept';
      icon = 'check-to-slot';
  }

  return { action, text, icon };
};
