import { Menu } from './menu';

export interface Page {
    readonly id: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly linkId: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    // readonly sectionCount: number | null;
}
