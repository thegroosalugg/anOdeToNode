export const PEER_CONFIG = {
  sent: {
    action: 'delete',
      text: 'Cancel',
      icon: 'rectangle-xmark',
       hsl: [10, 54, 51],
     color: '#fff',
  },
  received: {
    action: 'accept',
      text: 'Accept',
      icon: 'check-to-slot',
       hsl: [150, 54, 50],
     color: '#fff',
  },
  accepted: {
    action: '',
      text: 'Message',
      icon: 'comment',
       hsl: [110, 54, 35],
     color: '#fff',
  },
  none: {
    action: 'add',
      text: 'Add Friend',
      icon: 'user-plus',
       hsl: [0, 0, 89],
     color: 'var(--team-green)',
  },
} as const;
