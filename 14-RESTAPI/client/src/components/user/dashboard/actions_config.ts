import Friend from '@/models/Friend';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type ReqAction = 'add' | 'delete' | 'accept' | undefined; // if undefined function will return

export const actionsConfig = (connection: Friend | undefined) => {
  const { initiated, accepted } = connection ?? {};

  let action: ReqAction = 'add';
  let text              = 'Add Friend';
  let icon:    IconProp = 'user-plus';
  let background        = "var(--accept)"

  if (accepted) {
        action = undefined;
          text = 'Message';
          icon = 'comment';
    background = "var(--accent)";
  } else if (initiated) {
        action = 'delete';
          text = 'Cancel';
          icon = 'rectangle-xmark';
    background = "var(--error)";
  } else if (connection && !initiated && !accepted) {
        action = 'accept';
          text = 'Accept';
          icon = 'check-to-slot';
    background = "var(--accept)";
  }

  return { action, text, icon, background };
};
