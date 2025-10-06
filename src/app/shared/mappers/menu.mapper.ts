import type { Menu } from '../interfaces/menu';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';

export interface MenuEntity {
    readonly id_menu: number;
    readonly title: string;
    readonly order_num: number;
    readonly active: number; // 1 or 0
    readonly parent_id: number | null;
    readonly link_id: number | null;
    readonly children?: MenuEntity[] | null;
    readonly link: LinkEntity | null;
}

export const mapMenuEntityToMenu = (entity: MenuEntity): Menu => {
    return {
        id: entity.id_menu,
        title: entity.title,
        order: entity.order_num,
        active: entity.active === 1,
        parentId: entity.parent_id,
        children: entity.children ? entity.children.map((child) => mapMenuEntityToMenu(child)) : null,
        linkId: entity.link_id,
        link: entity.link ? mapLinkEntityToLink(entity.link) : null
    };
};
