import { Section } from '../interfaces/section';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';
import { mapMenuEntityToMenu, MenuEntity } from './menu.mapper';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from './section-item.mapper';

export enum SectionType {
    HERO = 'HERO',
    WHY_US = 'WHY_US',
    CASH_PROCESSING_EQUIPMENT = 'CASH_PROCESSING_EQUIPMENT',
    VALUE_PROPOSITION = 'VALUE_PROPOSITION',
    OUR_COMPANY = 'OUR_COMPANY',
    MACHINE = 'MACHINE',
    CONTACT_TOP_BAR = 'CONTACT_TOP_BAR',
    CLIENT = 'CLIENT',
    MAIN_NAVIGATION_MENU = 'MAIN_NAVIGATION_MENU',
    CTA_BANNER = 'CTA_BANNER',
    SOLUTIONS_OVERVIEW = 'SOLUTIONS_OVERVIEW',
    MISSION_VISION = 'MISSION_VISION',
    CONTACT_US = 'CONTACT_US',
    FOOTER = 'FOOTER',

    // BENEFIT = 'BENEFIT',
    // MACHINE_TYPE = 'MACHINE_TYPE',
    // BILL_MACHINE = 'BILL_MACHINE',
    // COIN_MACHINE = 'COIN_MACHINE',
    // CONTACT = 'CONTACT',
}

export interface SectionEntity {
    id_section: number;
    order_num: number;
    type: SectionType;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    text_button: string | null;
    link_id: number | null;
    active: boolean;
    image: string | null;
    page_id: number;
    section_items: SectionItemEntity[];
    link: LinkEntity | null;
    menus: MenuEntity[] | null;
}

export const mapSectionEntityToSection = (entity: SectionEntity): Section => {
    return {
        id: entity.id_section,
        orderNum: entity.order_num,
        type: entity.type,
        title: entity.title,
        subtitle: entity.subtitle,
        description: entity.description,
        textButton: entity.text_button,
        linkId: entity.link_id,
        image: entity.image,
        active: Boolean(entity.active),
        pageId: Number(entity.page_id),
        link: entity.link ? mapLinkEntityToLink(entity.link) : null,
        items: entity?.section_items && entity.section_items.length > 0 ? entity.section_items.map((item) => mapSectionItemEntityToSectionItem(item)) : [],
        menus: entity?.menus && entity.menus.length > 0 ? entity.menus.map(mapMenuEntityToMenu) : []
    };
};
