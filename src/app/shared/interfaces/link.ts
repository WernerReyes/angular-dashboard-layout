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
}


type Options = {
    label: string;
    value: LinkType;
};

export const linkTypeOptions: Record<LinkType, Options> = {
    [LinkType.EXTERNAL]: {
        label: 'URL Externa',
        value: LinkType.EXTERNAL
    },
    [LinkType.PAGE]: {
        label: 'Página Interna',
        value: LinkType.PAGE
    }
};
