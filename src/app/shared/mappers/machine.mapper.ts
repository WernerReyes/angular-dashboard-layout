import { Machine } from '../interfaces/machine';
import { CategoryEntity, mapCategoryEntityToCategory } from './category.mapper';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';
import { mapSectionEntityToSection, SectionEntity } from './section.mapper';

export type TecnicalSpecifications = {
    id: string;
    title: string;
    description: string;
};

export interface MachineEntity {
    id_machine: number;
    name: string;
    description: string | null;
    long_description: string | null;
    images: string[] | null;
    manual: string | null;
    technical_specifications: TecnicalSpecifications[] | null;
    category_id: number;
    link_id: number | null;
    text_button: string | null;
    link: LinkEntity | null;
    category: CategoryEntity | null;
    sections: SectionEntity[] | null;
    created_at: Date;
    updated_at: Date;
}

export const mapMachineEntityToMachine = (entity: MachineEntity): Machine => {
    return {
        id: entity.id_machine,
        description: entity.description,
        longDescription: entity.long_description,
        name: entity.name,
        images: entity.images,
        manual: entity.manual,
        category: entity.category ? mapCategoryEntityToCategory(entity.category) : null,
        technicalSpecifications: entity.technical_specifications,
        categoryId: entity.category_id,
        linkId: entity.link_id,
        textButton: entity.text_button,
        link: entity.link ? mapLinkEntityToLink(entity.link) : null,
        sections: entity.sections ? entity.sections.map(mapSectionEntityToSection) : null,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at
    };
};
