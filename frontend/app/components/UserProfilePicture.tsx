import styles from '@/app/styles/profilePicture.module.css'
import Image from 'next/image';

type UserProfilePictureProps = {
    profile_picture: string;
    alt: string;
}

const UserProfilePicture: React.FC<UserProfilePictureProps> = (
    { profile_picture, alt }
) => {
    return (
        <Image
            src={profile_picture ? profile_picture : '/blank-profile-picture.png'}
            alt={alt}
            className={styles.profilePicture}
            width={500}
            height={500}
        />
    );
}

export default UserProfilePicture;