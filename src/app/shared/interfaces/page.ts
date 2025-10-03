import { Menu } from './menu';

export interface Page {
    readonly id: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly active: boolean;
    readonly status: PageStatus;
    readonly linkId: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    // readonly sectionCount: number | null;
}

export enum PageStatus {
    DRAFT = 'Borrador',
    PUBLISHED = 'Publicado'
}

export const pageStatusOptions = {
    [PageStatus.DRAFT]: {
        label: 'Borrador',
        value: PageStatus.DRAFT,
        severity: 'info',
        icon: 'pi pi-eye-slash'
    },
    [PageStatus.PUBLISHED]: {
        label: 'Publicado',
        value: PageStatus.PUBLISHED,
        severity: 'success',
        icon: 'pi pi-eye'
    }
};
