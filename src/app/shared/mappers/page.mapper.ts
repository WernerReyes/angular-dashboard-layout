import { Page, PageStatus } from '../interfaces/page';

export interface PageEntity {
    readonly id_page: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly active: boolean;
    readonly link_id: number | null;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapPageEntityToPage = (entity: PageEntity): Page => {
    return {
        id: entity.id_page,
        title: entity.title,
        slug: entity.slug,
        description: entity.description,
        active: Boolean(entity.active),
        status: entity.active ? PageStatus.PUBLISHED : PageStatus.DRAFT,
        linkId: entity.link_id,
        createdAt: new Date(entity.created_at),
        updatedAt: new Date(entity.updated_at)
    };
};

// "id_page": 1,
