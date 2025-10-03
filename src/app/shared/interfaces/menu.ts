import { LinkType } from '../mappers/link.mapper';
import { Page } from './page';

export interface Menu {
    readonly id: number;
    readonly title: string;
    readonly url: string | null;
    readonly slug: string;
    readonly order: number;
    readonly active: boolean;
    readonly parentId: number | null;
    readonly userId: number;
    readonly children?: Menu[];
    readonly page: Page | null;
    readonly type: string;
}
// LinkType

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
