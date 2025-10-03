export interface Category {
    readonly id: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly imageUrl: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
