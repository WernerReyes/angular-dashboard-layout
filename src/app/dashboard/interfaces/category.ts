import type { CategoryType } from "@/shared/mappers/category.mapper";

export interface CreateCategory {
    title: string;
    type: CategoryType;
}