import { User } from '@/shared/interfaces/user';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    readonly user: User;
    readonly accessToken: string;
    readonly refreshToken: string;
}
