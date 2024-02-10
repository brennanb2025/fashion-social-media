"use client";
import React, { useState, useEffect } from 'react';
import globalStyles from '@/app/styles/myGlobals.module.css'
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function Logout() {

  //const [logoutState, setLogoutState] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if(sessionStorage.getItem('refresh_token') === null) { // already logged out
        sessionStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
        router.push('/');
    } else {
        sessionStorage.clear(); // clear regardless
        logoutUser();
    }
  }, []);

  const logoutUser = () => {
    axios.post('http://localhost:8000/api/logout/', 
        {'refresh_token': sessionStorage.getItem('refresh_token')}
    ).then((res) => {
        sessionStorage.clear();
        axios.defaults.headers.common['Authorization'] = null;
        const timerId = setTimeout(() => {
            router.push('/'); // back to home after 1000ms
        }, 1000);
        return () => clearTimeout(timerId);
    })
    .catch((err) => console.log(err));
  };

  return (
    <div>
        <Navbar />
        Logout successful. See you next time.
    </div>
  );
}