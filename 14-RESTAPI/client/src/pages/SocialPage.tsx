import { Auth } from './RootLayout';

export default function SocialPage({ user }: Auth) {
  if (user) return <></>;
}
