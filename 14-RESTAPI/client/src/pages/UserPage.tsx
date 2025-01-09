import LoginForm from "@/components/form/LoginForm";
import { AuthProps } from "./RootLayout";

export default function UserPage({ user, setData }: AuthProps) {

  console.log(user, setData)

  return <LoginForm callback={(user) => console.log('LOGINFORM', user)} />
}
