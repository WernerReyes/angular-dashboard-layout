import type { Link } from '../interfaces/link';
import { PageEntity } from './page.mapper';

export enum LinkType {
    PAGE = 'PAGE',
    EXTERNAL = 'EXTERNAL'
}

type PageLink = Pick<PageEntity, 'id_page' | 'title' | 'slug'>;

export interface LinkEntity {
    readonly id_link: number;
    readonly title: string;
    readonly type: LinkType;
    readonly url: string | null;
    readonly page_id: number | null;
    readonly created_at: string;
    readonly updated_at: string;
    readonly new_tab: number; // 1 or 0
    readonly page?: PageLink | null;
}

export const mapLinkEntityToLink = (entity: LinkEntity): Link => ({
    id: entity.id_link,
    title: entity.title,
    type: entity.type,
    url: entity.url,
    pageId: entity.page_id,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
    openInNewTab: entity.new_tab === 1,
    page: entity.page
        ? {
              id: entity.page.id_page,
              title: entity.page.title,
              slug: entity.page.slug
          }
        : null
});
