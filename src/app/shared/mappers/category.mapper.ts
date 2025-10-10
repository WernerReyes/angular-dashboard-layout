import type { Category } from '../interfaces/category';

export interface CategoryEntity {
    readonly id_category: number;
    readonly title: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapCategoryEntityToCategory = (entity: CategoryEntity): Category => ({
    id: entity.id_category,
    title: entity.title,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at)
});
