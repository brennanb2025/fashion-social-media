"use client";

import React, { useState, useEffect } from 'react';
import { ProfileCard } from "../../components/ProfileCard"
import { User } from "../../types/User";
import { Navbar } from '../../components/Navbar'

import axios from 'axios';

export default function Profile({ params }: { params: { username: string } }) {
    const [loggedInUser, setLoggedInUser] = useState<User>();

    useEffect(() => {
        if(sessionStorage.getItem('username') !== null) {  // already logged in
            fetchLoggedInUser(sessionStorage.getItem('username')!);
        }
    }, []);
    // const user: User = {
    //     id: 1,
    //     username: 'testUsername',
    //     email: 'test@test.com',
    //     first_name: 'testFirst',
    //     last_name: 'testLast',
    //     bio: 'biooo',
    //     height: 165
    //     weight: 150,
    //     profile_picture: 'todo',
    //     is_active: true,
    // }

    const [user, setUser] = useState<User>();

    const fetchUser = () => {
        axios.get<User>(`http://localhost:8000/api/users/${params.username}/`)
        .then((res) => setUser(res.data))
        .catch((err) => console.log(err));
    };

    const fetchLoggedInUser = (username:string) => {
        axios.get<User>(`http://localhost:8000/api/users/${username}/`)
        .then((res) => setLoggedInUser(res.data))
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            {user ? <ProfileCard user={user} loggedInUser={loggedInUser} /> : "User not found" }
        </div>
    )
}