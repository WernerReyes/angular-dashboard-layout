import { Section } from '../interfaces/section';
import { mapSectionItemEntityToSectionItem, SectionItemEntity } from './section-item.mapper';

export enum SectionType {
    HERO = 'HERO',
    BENEFIT = 'BENEFIT',
    MACHINE_TYPE = 'MACHINE_TYPE',
    BILL_MACHINE = 'BILL_MACHINE',
    VALUE_PROPOSITION = 'VALUE_PROPOSITION',
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
    page_id: number;
    section_items: SectionItemEntity[];
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
        active: Boolean(entity.active),
        pageId: entity.page_id,
        items: entity.section_items.length === 0 ? [] : entity.section_items.map((item) => mapSectionItemEntityToSectionItem(item))
    };
};
