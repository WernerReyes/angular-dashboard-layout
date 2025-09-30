import type { UserEntity } from '@/shared/mappers/user.mapper';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    readonly user: UserEntity;
    readonly accessToken: string;
    readonly refreshToken: string;
}
