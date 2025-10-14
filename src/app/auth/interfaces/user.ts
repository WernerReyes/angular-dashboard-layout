export interface UpdateProfile {
    firstName: string;
    lastName: string;
    email: string;
    profileFile?: File | null;
    currentProfileUrl?: string | null;
}


export interface UpdatePassword {
    oldPassword: string;
    newPassword: string;
}