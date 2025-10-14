import type { User } from "../interfaces/user";


export enum UserRole {
    USER = 'USER',
}

export interface UserEntity {
    readonly id_user: number;
    readonly name: string;
    readonly lastname: string;
    readonly email: string;
    readonly role: UserRole;
    readonly profile: string | null;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapUserEntityToUser = (entity: UserEntity): User => {
    return {
    id: entity.id_user,
    name: entity.name,
    lastname: entity.lastname,
    email: entity.email,
    role: entity.role,
    profile: entity.profile,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
    
}};
