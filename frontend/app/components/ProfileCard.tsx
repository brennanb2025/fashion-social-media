"use client"; // This is a client component

import React, { useState, useEffect } from "react";
//import Modal from "./components/Modal";
//import axios from "axios";

import globalStyles from '../styles/myGlobals.module.css';
import { UserProps } from "../types/User";
import styles from '../styles/profileCard.module.css';
import Modal from "./Modal";
import UserFollowerList from "./Followers";
import UserFollowingList from "./Following";
import UserProfilePicture from './UserProfilePicture';

import UserPostGrid from "./UserPostGrid";

import Link from 'next/link';


export const ProfileCard = ({user, loggedInUser} : UserProps ) => {

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

    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);

    const openFollowersModal = () => {
        setFollowersModalOpen(true);
    };

    const closeFollowersModal = () => {
        setFollowersModalOpen(false);
    };

    const openFollowingModal = () => {
        setFollowingModalOpen(true);
    };

    const closeFollowingModal = () => {
        setFollowingModalOpen(false);
    };

    return (
        <div className={globalStyles.text1}>
            <Modal open={followersModalOpen} close={closeFollowersModal} title="Followers">
                <UserFollowerList user={user} loggedInUser={loggedInUser} />
            </Modal>
            <Modal open={followingModalOpen} close={closeFollowingModal} title="Following">
                <UserFollowingList user={user} loggedInUser={loggedInUser} />
            </Modal>


            <div className={styles.profileCard}>
                <div>
                    <div className={styles.profilePictureContainer}>
                        <UserProfilePicture 
                            profile_picture={user.profile_picture}
                            alt={`${user.first_name} ${user.last_name}`}
                        />
                    </div>
                    <div className={styles.userInfo}>
                        <h2>{`${user.first_name} ${user.last_name}`}</h2>
                        <Link href={`/profile/${user.username}`}>
                            @{user.username}
                        </Link>
                        <p>{user.bio}</p>
                        <p>{`${user.height}, ${user.weight} lbs`}</p>
                        <button>
                            <Link href={`/edit-profile/`}>
                                Edit profile
                            </Link>
                        </button>
                        <div>
                            <button className="btn btn-info" onClick={openFollowersModal}>
                                Followers
                            </button><br/>
                            <button className="btn btn-info" onClick={openFollowingModal}>
                                Following
                            </button>
                        </div>
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