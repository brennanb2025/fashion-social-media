"use client";

import React, { useState, useEffect } from 'react';
import MakePostCard from '../../components/MakePostCard';
import { User } from "../../types/User";
import { Navbar } from '../../components/Navbar'

import axios from 'axios';

export default function Post({ params }: { params: { username: string } }) {

    // const user: User = {
    //     id: 1,
    //     username: 'testUsername',
    //     email: 'test@test.com',
    //     first_name: 'testFirst',
    //     last_name: 'testLast',
    //     bio: 'biooo',
    //     height: "5'11",
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

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            {user ? <MakePostCard id={ user.id } /> : "User not found" }
        </div>
    )
}