// $this->id = $data['id_menu'];
//         $this->title = $data['title'];
//         $this->url = $data['url'];
//         $this->slug = $data['slug'];
//         $this->order = $data['order'];
//         $this->active = $data['active'] == 1 ? true : false;
//         $this->parentId = $data['parent_id'];
//         $this->userId = $data['users_id'];

import { Menu } from "../interfaces/menu";



export interface MenuEntity {
    readonly id_menu: number;
    readonly title: string;
    readonly url: string | null;
    readonly slug: string;
    readonly order: number;
    readonly active: number; // 1 or 0
    readonly parent_id: number | null;
    readonly users_id: number;
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
        userId: entity.users_id
    };
}
