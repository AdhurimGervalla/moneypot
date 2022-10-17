import styles from './Navbar.module.css';
import Link from 'next/link';
import { useContext } from "react";
import { UserContext } from "../../lib/context";
// Top navbar
export default function Navbar() {
    const { user, username } = useContext(UserContext);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.list}>

        {/* user is signed-in and has username */}
        {username && (
          <>
                      <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}
        <li>
          <Link href="/">
            <button className="btn-logo">Home</button>
          </Link>
        </li>

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/login">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}