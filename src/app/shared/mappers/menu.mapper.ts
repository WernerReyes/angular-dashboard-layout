import { MenuTypes } from '@/dashboard/interfaces/menu';
import type { Menu } from '../interfaces/menu';
import { mapPageEntityToPage, type PageEntity } from './page.mapper';

export interface MenuEntity {
    readonly id_menu: number;
    readonly title: string;
    readonly url: string | null;
    readonly slug: string;
    readonly order: number;
    readonly active: number; // 1 or 0
    readonly parent_id: number | null;
    readonly users_id: number;
    readonly page: PageEntity | null;
    readonly children?: MenuEntity[];
}

export const mapMenuEntityToMenu = (entity: MenuEntity): Menu => {
    return {
        id: entity.id_menu,
        title: entity.title,
        url: entity.url,
        slug: entity.slug,
        order: entity.order,
        active: entity.active === 1,
        parentId: entity.parent_id,
        userId: entity.users_id,
        children: entity.children ? entity.children.map(mapMenuEntityToMenu) : [],
        type: getMenuType(entity),
        page: entity.page ? mapPageEntityToPage(entity.page) : null
    };
};

const getMenuType = (menu: MenuEntity): MenuTypes  => {
    if (menu.url) {
        return MenuTypes.EXTERNAL_LINK;
    }

    if (menu.children && menu.children.length > 0) {
        return MenuTypes.DROPDOWN;
    }

   
    return MenuTypes.INTERNAL_PAGE;
    // return "unknown";   
};
