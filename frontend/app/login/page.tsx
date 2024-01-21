"use client";
import React, { useState, useEffect } from 'react';
import globalStyles from '@/app/styles/myGlobals.module.css'
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/navigation';

import styles from '@/app/styles/registerUser.module.css';
import { UserLoginData, LoginUserResult, User } from '../types/User';

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const router = useRouter(); // Nextjs router object

  const [loginError, setLoginError] = useState<boolean>(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

  useEffect(() => {
    if(sessionStorage.getItem('username') !== null) {  // already logged in
        router.push(`/profile/${sessionStorage.getItem('username')}`); // nav to profile page
    }
  }, []);

  const hideErrors = () => {
    setLoginError(false);
  }

  const showErrors = () => {
    setLoginError(true);
    const timerId = setTimeout(() => {
        const timerId = setTimeout(() => {
            hideErrors();
        }, 200);
    
        return () => clearTimeout(timerId);
    }, 400);

    return () => clearTimeout(timerId);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(username === '' || password === '') {
        if(username === "") {
            setUsernameError("Please input your username.")
        }
        if(username === "") {
            setPasswordError("Please input your password.")
        }
        showErrors();
        return;
    }

    // Registration data to submit
    const loginData: UserLoginData = {
      username: username,
      password: password,
    };

    axios.post<LoginUserResult>(`http://localhost:8000/token/`, loginData)
      .then(response => {
        // Handle successful registration (redirect, show a success message, etc.)
        sessionStorage.clear();
        sessionStorage.setItem('access_token', response.data.access);
        sessionStorage.setItem('refresh_token', response.data.refresh);
        sessionStorage.setItem('username', username);
        fetchUser(username);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        router.push(`/profile/${username}`); // nav to profile page
      })
      .catch(error => {
        // error.response.data.detail = No active account found with the given credentials
        setLoginErrorMessage("We couldn't find an account with those credentials."); 

        // Handle registration error (display error message, etc.)
        console.error('Login failed:', error);
      });
  };

  const fetchUser = (username:string) => {
    axios.get<User>(`http://localhost:8000/api/users/${username}/`)
    .then((res) => sessionStorage.setItem('id', res.data.id.toString()))
    .catch((err) => console.log(err));
  };

  return (
    <div>
        <Navbar />
        <main className={`${styles.borderContainer} mt-5`}>
            <div className={globalStyles.text1}>
                <h1 className="m-4">Login</h1>
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={`${styles.row} row`}>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Username
                            <input type="text" value={username} 
                                className={`
                                    ${usernameError !== '' && styles.error}
                                    ${styles.registerInput} 
                                    ${loginError ? styles.registerError : ""}`}
                                onChange={(e) => setUsername(e.target.value)} />
                            {
                                usernameError &&
                                    <span className={styles.errorMessage}>{usernameError}</span>
                            }
                        </div>

                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Password
                            <input type="password" value={password} 
                                className={`${styles.registerInput}
                                    ${passwordError !== '' && styles.error}
                                    ${loginError ? styles.registerError : ""}`}
                                onChange={(e) => setPassword(e.target.value)} />
                            {
                                passwordError && 
                                    <span className={styles.errorMessage}>{passwordError}</span>
                            }
                        </div>
                        
                    </div>
                
                    <button type="submit" className={`${styles.registerButton} mb-5 mt-2`}>
                        Login
                    </button>
                    {
                        loginErrorMessage && 
                            <div className={`${styles.loginErrorMessage}`}>{loginErrorMessage}</div>
                    }
                </form>
            </div>
        </main>
    </div>
  );
}