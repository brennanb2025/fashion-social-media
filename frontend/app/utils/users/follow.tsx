import axios from 'axios';
import { FollowUserResult } from '@/app/types/User';

// not in use, just doing it manually for now
const followUser = (user_id1:number, user_id2:number) => {
    axios.post<FollowUserResult>(`http://localhost:8000/api/users/${user_id1}/follow/${user_id2}/`)
      .then((res) => {return res.data.message})
      .catch((err) => console.log(err));
};

export default followUser;