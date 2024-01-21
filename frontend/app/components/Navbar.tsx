"use client"

import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { useState, useEffect } from 'react';

export const Navbar = () => {

    const [loggedInUser, setLoggedInUser] = useState<string>('');

    useEffect(() => {
        if(sessionStorage.getItem('username') !== null) {  // already logged in
            setLoggedInUser(sessionStorage.getItem('username')!);
        }
    }, []);
    
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
            { loggedInUser === '' ? 
                <Link href={`/login`}>
                    Login
                </Link> :
                <div>
                    <Link href={`/profile/${loggedInUser}`}>
                        Profile
                    </Link>
                    <Link href={`/logout`}>
                        Logout
                    </Link>
                </div>
            }
        </div>
    </nav>
  );
};
