import type { User } from "../interfaces/user";

export interface UserEntity {
    readonly id_user: number;
    readonly name: string;
    readonly lastname: string;
    readonly email: string;
    readonly role: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapUserEntityToUser = (entity: UserEntity): User => ({
    id: entity.id_user,
    name: entity.name,
    lastname: entity.lastname,
    email: entity.email,
    role: entity.role,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
    createdAtString: entity.created_at,
    updatedAtString: entity.updated_at
});
