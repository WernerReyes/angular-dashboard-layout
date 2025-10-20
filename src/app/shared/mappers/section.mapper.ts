import { Section } from '../interfaces/section';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';
import { mapMenuEntityToMenu, MenuEntity } from './menu.mapper';
import { mapPageEntityToPage, PageEntity } from './page.mapper';
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
    ADVANTAGES = 'ADVANTAGES',
    SUPPORT_MAINTENANCE = 'SUPPORT_MAINTENANCE',
    PRODUCT_DETAILS = 'PRODUCT_DETAILS'
}

export enum SectionMode {
    CUSTOM = 'CUSTOM',
    LAYOUT = 'LAYOUT'
}

type PivotPagesEntity = {
    id_page: number;
    id_section: number;
    order_num: number;
    active: boolean;
    type: SectionMode;
};

export interface SectionEntity {
    id_section: number;
    type: SectionType;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    text_button: string | null;
    link_id: number | null;
    active: boolean;
    image: string | null;
    section_items: SectionItemEntity[];
    link: LinkEntity | null;
    menus: MenuEntity[] | null;
    pivot_pages?: PivotPagesEntity[] | null;
    pages?: (PageEntity & { pivot: PivotPagesEntity })[] | null;

}

export const mapSectionEntityToSection = (entity: SectionEntity): Section => {
    return {
        id: entity.id_section,
        type: entity.type,
        title: entity.title,
        subtitle: entity.subtitle,
        description: entity.description,
        textButton: entity.text_button,
        linkId: entity.link_id,
        image: entity.image,
        link: entity.link ? mapLinkEntityToLink(entity.link) : null,
        items: entity?.section_items && entity.section_items.length > 0 ? entity.section_items.map((item) => mapSectionItemEntityToSectionItem(item)) : [],
        menus: entity?.menus && entity.menus.length > 0 ? entity.menus.map(mapMenuEntityToMenu) : [],
        pivotPages:
            entity?.pivot_pages && entity.pivot_pages.length > 0
                ? entity.pivot_pages.map((item) => ({
                      orderNum: item.order_num,
                      idPage: item.id_page,
                      // id_section: item.id_section,
                      active: Boolean(item.active),
                      type: item.type
                  }))
                : null,

        pages: entity?.pages && entity.pages.length > 0
            ? entity.pages.map((item) => ({
                  ...mapPageEntityToPage(item),
                  pivot: item.pivot ? {
                      idPage: item.pivot.id_page,
                      orderNum: item.pivot.order_num,
                      active: Boolean(item.pivot.active),
                      type: item.pivot.type
                  } : undefined
              }))
            : null
    };
};
