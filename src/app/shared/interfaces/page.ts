import { Menu } from './menu';
import { Section } from './section';

export interface Page {
    readonly id: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly linkId: number | null;
    isMain: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly sections: Section[] | null;

    // readonly sectionCount: number | null;
}
