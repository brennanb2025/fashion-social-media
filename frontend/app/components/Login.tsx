"use client"; // This is a client component

import React, { useState, useEffect } from "react";
//import Modal from "./components/Modal";
import axios from "axios";

import globalStyles from '../styles/myGlobals.module.css';


export const UserCreation = () => {

    const [userList, setUserList] = useState<User[]>([]);

    const refreshUserList = () => {
        //just calling /api/users/ isn't working due to rewrites not working
        axios.get("http://localhost:8000/api/users/")
        .then((res) => setUserList(res.data))
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        refreshUserList();
    }, [])

  /*handleDelete = (user) => {
    axios
      .delete(`/api/users/${item.id}/`)
      .then((res) => this.refreshList());
  };*/

    const renderUserList = () => {
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
    };

    return (
        <main className="container">
            <div className={globalStyles.text1}>
                <h1 className="text-uppercase text-center my-4">User page</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        Users:
                        <ul className="list-group list-group-flush border-top-0">
                            {renderUserList()}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

//export default UserCreation;