import { Section } from '../interfaces/section';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from './section-item.mapper';

export enum SectionType {
    HERO = 'HERO',
    WHY_US = 'WHY_US',
    CASH_PROCESSING_EQUIPMENT = 'CASH_PROCESSING_EQUIPMENT',
    VALUE_PROPOSITION = 'VALUE_PROPOSITION',
    OUR_COMPANY = 'OUR_COMPANY',
    MACHINE = 'MACHINE',

    BENEFIT = 'BENEFIT',
    MACHINE_TYPE = 'MACHINE_TYPE',
    BILL_MACHINE = 'BILL_MACHINE',
    COIN_MACHINE = 'COIN_MACHINE',
    CLIENT = 'CLIENT',
    CONTACT = 'CONTACT',
    FOOTER = 'FOOTER'
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
        items: entity?.section_items && entity.section_items.length > 0 ? entity.section_items.map((item) => mapSectionItemEntityToSectionItem(item)) : []
    };
};
