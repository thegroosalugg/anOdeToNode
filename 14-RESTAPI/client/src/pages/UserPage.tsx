import LoginForm from "@/components/form/LoginForm";
import User from "@/models/User";

export default function UserPage({ user }: { user: User | null }) {

  if (user) console.log('');

  return <LoginForm callback={(user) => console.log('LOGINFORM', user)} />
}
