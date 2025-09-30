export interface User {
    readonly id: number;
    readonly name: string;
    readonly lastname: string;
    readonly email: string;
    readonly role: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly createdAtString: string;
    readonly updatedAtString: string;
}
