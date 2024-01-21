export type User = {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    bio: string,
    height: number,
    weight: number,
    profile_picture: string,
    is_active: boolean,
}
  
export interface UserProps {
    user: User,
}

export type ValidateUsernameResult = {
    valid: boolean,
}

export type ValidateEmailResult = {
    valid: boolean,
}

export type ValidateUsernameWithMessage = {
    valid: boolean,
    message: string,
}

export type ValidateEmailWithMessage = {
    valid: boolean,
    message: string,
}

export type RegisterUserResult = {
    status: string,
    message: string,
}

export type UserRegistrationData = {
    first: String,
    last: String,
    username: String,
    email: String,
    password1: String,
    password2: String,
};

export type UserLoginData = {
    username: String,
    password: String,
};

export type LoginUserResult = {
    refresh: string,
    access: string,
};