import LoginForm from './LoginForm';

export default function LoginPage({
  searchParams
}: {
  searchParams?: { redirect?: string };
}) {
  return <LoginForm redirect={searchParams?.redirect} />;
}
