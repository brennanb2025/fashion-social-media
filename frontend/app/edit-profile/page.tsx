"use client"; // This is a client component

import React, { useState, useEffect } from "react";
import axios from 'axios';

import globalStyles from '@/app/styles/myGlobals.module.css';
import styles from '@/app/styles/editProfile.module.css';
import { User } from "../types/User";

import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/navigation';


export default function EditProfile() {

    const router = useRouter(); // Nextjs router object
    const [user, setUser] = useState<User>();


    useEffect(() => {
        if(sessionStorage.getItem('username') === null) {
            router.push('/login'); // must be logged in
        }
        fetchUser(sessionStorage.getItem('username')!);
      }, []);

    const fetchUser = (username:string) => {
        axios.get<User>(`http://localhost:8000/api/users/${username}/`)
        .then((res) => {
            setUser(res.data);
        })
        .catch((err) => console.log(err));
    };

    /*const renderUserList = () => {
        return userList.map((user) => (
            <li
                key={user.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                {user.username}
                {user.email}
                {user.first_name}
                {user.last_name}
                {user.bio}
                {user.height}
                {user.weight}
                {user.is_active}
            </li>
        ));
    };*/

    return (
        <div>
            <Navbar />
            <div className={globalStyles.text1}>
                Edit profile
                {
                    user &&
                        <div>
                            <div className={styles.profileCard}>
                            <div>
                                <div className={styles.profilePictureContainer}>
                                    <img
                                        src={user.profile_picture}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        className={styles.profilePicture}
                                    />
                                </div>
                                <div className={styles.userInfo}>
                                    <h2>{`${user.first_name} ${user.last_name}`}</h2>
                                    <p>{user.bio}</p>
                                    <p>{`${user.height}, ${user.weight} lbs`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}