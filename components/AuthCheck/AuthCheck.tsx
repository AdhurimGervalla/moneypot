import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { user, username } = useContext(UserContext);

  return user ? props.children : props.fallback || <Link href="/login">You must be signed in</Link>;
}