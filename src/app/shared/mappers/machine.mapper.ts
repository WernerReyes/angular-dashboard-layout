import { Machine } from '../interfaces/machine';
import { CategoryType } from './category.mapper';

export type TecnicalSpecifications = {
    title: string;
    description: string;
};

export interface MachineEntity {
    id_machine: number;
    name: string;
    description: string | null;
    long_description: string | null;
    images: string[] | null;
    tecnical_specifications: TecnicalSpecifications[] | null;
    category_id: number;
    category_title: string;
    category_type: CategoryType;
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
        tecnicalSpecifications: entity.tecnical_specifications,
        categoryId: entity.category_id,
        categoryTitle: entity.category_title,
        categoryType: entity.category_type,
        createdAt: entity.created_at,
        updatedAt: entity.updated_at
    };
};
