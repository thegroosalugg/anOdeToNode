export const PEER_CONFIG = {
  sent: {
    action: 'delete',
      text: 'Cancel',
      icon: 'rectangle-xmark',
       hsl: [10, 54, 51],
  },
  received: {
    action: 'accept',
      text: 'Accept',
      icon: 'check-to-slot',
       hsl: [150, 54, 50],
  },
  accepted: {
    action: undefined,
      text: 'Message',
      icon: 'comment',
       hsl: [110, 54, 35],
  },
  none: {
    action: 'add',
      text: 'Add Friend',
      icon: 'user-plus',
       hsl: [0, 0, 89],
  },
} as const;
