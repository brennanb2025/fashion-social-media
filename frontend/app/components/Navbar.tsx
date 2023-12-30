import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
        <div className={styles.logo}>
            <Link href="/">
                Logo here
            </Link>
        </div>
        <div className={styles.links}>
            <Link href="/">
                Home
            </Link>
        </div>
        <div className={styles.links}>
            <Link href="/">
                Post
            </Link>
        </div>
        <div className={styles.links}>
            <Link href="/">
                Explore
            </Link>
        </div>
        <div className={styles.links}>
            <Link href="/profile">
                Profile
            </Link>
        </div>
    </nav>
  );
};
