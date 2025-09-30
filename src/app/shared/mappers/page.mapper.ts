import { Page } from "../interfaces/page";

export interface PageEntity {
    readonly id_pages: number;
    readonly title: string;
    readonly description: string | null;
    readonly active: number; // 1 or 0
    readonly menu_id: number | null;
    readonly created_at: string; // ISO date string
    readonly updated_at: string; // ISO date string

}

export const mapPageEntityToPage = (entity: PageEntity): Page => ({
    id: entity.id_pages,
    title: entity.title,
    description: entity.description,
    active: entity.active === 1,
    menuId: entity.menu_id,
    createdAt: new Date(entity.created_at),
    updatedAt: new Date(entity.updated_at),
    // createdAtString: entity.created_at,
    // updatedAtString: entity.updated_at
});