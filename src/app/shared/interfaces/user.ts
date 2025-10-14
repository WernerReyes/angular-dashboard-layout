import { UserRole } from '../mappers/user.mapper';
import type { Severity } from './severity';

export interface User {
    readonly id: number;
    readonly name: string;
    readonly lastname: string;
    readonly email: string;
    readonly role: UserRole;
    profile: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

type UserRoleOption = {
    label: string;
    value: UserRole;
    severity: Severity;
};

export const userRoleOptions: Record<UserRole, UserRoleOption> = {
    USER: { label: 'Usuario', value: UserRole.USER, severity: 'info' }
};
