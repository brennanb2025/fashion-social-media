import React, { useState, useEffect } from 'react';
import globalStyles from '../styles/myGlobals.module.css';
import axios from 'axios';
import { User } from '../types/User';
import styles from '@/app/styles/followersFollowing.module.css'
import Link from 'next/link';
import UserProfilePicture from './UserProfilePicture';
import followUser from '@/app/utils/users/follow';
import { toast } from 'react-hot-toast';

type UserFollowerListProps = {
    user: User,
    loggedInUser: User | undefined,
}

const UserFollowerList: React.FC<UserFollowerListProps> = ({ user, loggedInUser }) => {
  const [userFollowerList, setUserFollowerList] = useState<User[]>([]);

  // figure out a better way to query the following state for each user
  // it would be better if that information was loaded by the serializer on request
  // eg optional parameter lookupUserId passed that would add fields 
  // "isFollowingUser" and "isAFollowerOfUser" that would check if the user
  // is in the looked up user's follow

  const fetchUserFollowers = () => {
    // Assuming you have an API endpoint to fetch user posts
    axios.get<User[]>(`http://localhost:8000/api/users/${user.id}/followers/`)
      .then((res) => setUserFollowerList(res.data))
      .catch((err) => console.log(err));
  };

  // just following users manually
  const followAnotherUser = (user2:User) => {
    //followUser(user.id, user2.id);
    if(!loggedInUser) { // this shouldn't proc if page is correctly displayed
        toast.error("You must be logged in to follow another user.")
    }

    axios.post(`http://localhost:8000/api/users/${loggedInUser!.id}/follow/${user2.id}/`)
        .then((res) => {
            if(res.data.message === 'success') {
                toast.success(`Followed ${user2.username}`)
            } else {
                toast.error(res.data.message)
            }
        })
        .catch((err) => toast.error(err.response.data.message));
  }

  useEffect(() => {
    fetchUserFollowers();
  }, []);

  const renderUserList = () => {
    return userFollowerList.map((follower) => (
      <div key={follower.id}>
        <div className='row'>
            <div className='col'>
                <div className={styles.followInfoContainer}>
                    <div className={styles.profilePictureContainer}>
                        <Link href={`/profile/${follower.username}`}>
                            <UserProfilePicture 
                                profile_picture={follower.profile_picture}
                                alt={`${follower.first_name} ${follower.last_name}`}
                            />

                        </Link>
                    </div>
                    <Link href={`/profile/${follower.username}`}>
                        @{follower.username}
                    </Link>
                </div>
            </div>

            <div className={`${styles.colCenterButton} col`}>
                <button 
                        onClick={() => {followAnotherUser(follower)}}
                        className={`${styles.followButton} btn btn-primary`}
                    >
                    Follow/Unfollow (TODO)
                </button>
            </div>
        </div>
      </div>
    ));
  };

  return (
    <main className="container">
      <div className={globalStyles.text1}>
        {renderUserList()}
      </div>
    </main>
  );
};

export default UserFollowerList;