import type { Page } from '../interfaces/page';
import { mapSectionEntityToSection, SectionEntity } from './section.mapper';

export interface PageEntity {
    readonly id_page: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly link_id: number | null;
    readonly is_main: boolean;
    readonly created_at: string;
    readonly updated_at: string;
    readonly sections?: SectionEntity[] | null;
}

export const mapPageEntityToPage = (entity: PageEntity): Page => {
    return {
        id: entity.id_page,
        title: entity.title,
        slug: entity.slug,
        description: entity.description,
        linkId: entity.link_id,
        createdAt: new Date(entity.created_at),
        updatedAt: new Date(entity.updated_at),
        isMain: entity.is_main,
        sections: entity.sections ? (entity.sections.length > 0 ? entity.sections.map(mapSectionEntityToSection) : []) : null
    };
};

