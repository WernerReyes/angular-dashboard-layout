import { LinkType } from '../mappers/link.mapper';
import { Page } from './page';

type PageLink = Pick<Page, 'id' | 'title' | 'slug'>;

export interface Link {
    readonly id: number;
    readonly title: string;
    readonly type: LinkType;
    readonly url: string | null;
    readonly pageId: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly openInNewTab?: boolean;
    readonly page?: PageLink | null;
    readonly fileUrl?: string | null;
}

type Options = {
    label: string;
    value: LinkType;
    icon: string;
};

export const linkTypeOptions: Record<LinkType, Options> = {
    [LinkType.EXTERNAL]: {
        label: 'URL Externa',
        icon: 'pi pi-globe',
        value: LinkType.EXTERNAL
    },
    [LinkType.PAGE]: {
        label: 'Página Interna',
        icon: 'pi pi-file',
        value: LinkType.PAGE
    },
    [LinkType.FILE]: {
        label: 'Archivo',
        icon: 'pi pi-cloud-download',
        value: LinkType.FILE
    }
};
