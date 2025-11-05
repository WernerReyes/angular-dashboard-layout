import type { Menu } from '../interfaces/menu';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';

export interface MenuEntity {
    readonly id_menu: number;
    readonly title: string;
    readonly order_num: number;
    readonly parent_id: number | null;
    readonly link_id: number | null;
    readonly children?: MenuEntity[] | null;
    readonly link: LinkEntity | null;
    readonly parent?: MenuEntity | null;
    readonly created_at: string;
    readonly updated_at: string;
}

export const mapMenuEntityToMenu = (entity: MenuEntity): Menu => {
    return {
        id: entity.id_menu,
        title: entity.title,
        parentId: entity.parent_id,
        children: entity.children ? entity.children.map((child) => mapMenuEntityToMenu(child)) : null,
        linkId: entity.link_id,
        link: entity.link ? mapLinkEntityToLink(entity.link) : null,
        parent: entity.parent ? mapMenuEntityToMenu(entity.parent) : null,
        createdAt: new Date(entity.created_at),
        updatedAt: new Date(entity.updated_at)
    };
};
