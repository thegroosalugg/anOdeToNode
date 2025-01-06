import LoginForm from "@/components/form/LoginForm";

export default function UserPage() {
  return <LoginForm callback={(user) => console.log('LOGINFORM', user)} />
}
