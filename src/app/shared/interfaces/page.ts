import { Menu } from "./menu";

export interface Page {
    readonly id: number;
    readonly title: string;
    readonly description: string | null;
    readonly active: boolean;
    readonly menuId: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly menu: Menu | null;
    // readonly sectionCount: number | null;
}
