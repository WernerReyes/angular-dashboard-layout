import { Machine } from '../interfaces/machine';
import { CategoryEntity, CategoryType, mapCategoryEntityToCategory } from './category.mapper';

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
    category: CategoryEntity | null;
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
        createdAt: entity.created_at,
        updatedAt: entity.updated_at
    };
};
