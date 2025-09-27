
export interface Page {
    readonly id: number;
    readonly title: string;
    readonly description: string | null;
    readonly active: boolean;
    readonly menuId: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly sectionCount: number | null;
}
