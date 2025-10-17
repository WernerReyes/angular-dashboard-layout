import type { Link } from '../interfaces/link';
import { mapPageEntityToPage, PageEntity } from './page.mapper';

export enum LinkType {
    PAGE = 'PAGE',
    EXTERNAL = 'EXTERNAL',
    FILE = 'FILE'
}

export interface LinkEntity {
    readonly id_link: number;
    readonly title: string;
    readonly type: LinkType;
    readonly url: string | null;
    readonly page_id: number | null;
    readonly created_at: string;
    readonly updated_at: string;
    readonly new_tab: number; // 1 or 0
    readonly page?: PageEntity | null;
    readonly file_url?: string | null;
}

export const mapLinkEntityToLink = (entity: LinkEntity): Link => {
    
    return {
        id: entity.id_link,
        title: entity.title,
        type: entity.type,
        url: entity.url,
        pageId: entity.page_id,
        createdAt: new Date(entity.created_at),
        updatedAt: new Date(entity.updated_at),
        openInNewTab: entity.new_tab === 1,
        page: entity.page ? mapPageEntityToPage(entity.page) : null,
        fileUrl: entity.file_url || null
    };
};
