import type { LinkType } from '@/shared/mappers/link.mapper';

export interface CreateLink {
    readonly title: string;
    readonly type: LinkType;
    readonly url: string | null;
    readonly pageId: number | null;
    readonly openInNewTab?: boolean;
}
