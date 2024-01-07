"use client"; // This is a client component

import React, { useState, useEffect } from "react";
//import Modal from "./components/Modal";
//import axios from "axios";

import globalStyles from '../styles/myGlobals.module.css';
import { UserProps } from "../types/User";
import styles from '../styles/profileCard.module.css';

import UserPostGrid from "./UserPostGrid";

import Link from 'next/link';


export const ProfileCard = ({user} : UserProps ) => {

    /*const refreshUserList = () => {
        //just calling /api/users/ isn't working due to rewrites not working
        axios.get("http://localhost:8000/api/users/")
        .then((res) => setUserList(res.data))
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        refreshUserList();
    }, [])*/

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
        <div className={globalStyles.text1}>
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
                        <Link href={`/profile/${user.username}`}>
                            @{user.username}
                        </Link>
                        <p>{user.bio}</p>
                        <p>{`${user.height}, ${user.weight} lbs`}</p>
                    </div>
                </div>
                <div className="">
                    <UserPostGrid user={user} />
                </div>
            </div>
        </div>
    );
}

//export default UserCreation;