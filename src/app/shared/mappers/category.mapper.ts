import type { Category } from '../interfaces/category';

export interface CategoryEntity {
    readonly id_category: number;
    readonly title: string;
    readonly slug: string;
    readonly description: string | null;
    readonly image_url: string | null;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapCategoryEntityToCategory = (entity: CategoryEntity): Category => ({
    id: entity.id_category,
    title: entity.title,
    slug: entity.slug,
    description: entity.description,
    imageUrl: entity.image_url,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at)
});
