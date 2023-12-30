export type User =  {
    id: number; 
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string;
    height: string; 
    weight: number;
    profile_picture: string;
    is_active: boolean;
}
  
export interface UserProps {
    user: User,
}