import Link from 'next/link';
import { useContext } from "react";
import { UserContext } from "../../lib/context";
// Top navbar
export default function Navbar() {
    const { user } = useContext(UserContext);
    let navigationItems = [
      ['Home', '/'],
      ['Login', `/login`],
    ];
    if (user) {
      navigationItems = [
        ['Home', '/'],
        ['Userprofile', `/profile`],
        ['Login', `/login`],
      ]
    }

  return (
    <nav className="flex sm:justify-center space-x-4">
      {navigationItems.map(([title, url]) => (
        <Link key={url} href={url}>
          <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">{title}</a>
        </Link>
      ))}
    </nav>
  );
}