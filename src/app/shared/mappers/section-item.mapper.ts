import type { IconName } from '../constants/icons';
import type { SectionItem } from '../interfaces/section-item';
import { LinkEntity, mapLinkEntityToLink } from './link.mapper';

export enum InputType {
    TEXT = 'TEXT',
    EMAIL = 'EMAIL',
    TEXTAREA = 'TEXTAREA'
}

export enum IconType {
    LIBRARY = 'LIBRARY',
    IMAGE = 'IMAGE'
}


export interface Icon {
    name: IconName;
    size: number;
    color: string;
    strokeWidth: number;
}

    export interface AdditionalInfo {
        label: string;
        id: string;
    }

export interface SectionItemEntity {
    id_section_item: number;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    background_image: string | null;
    icon_url: string | null;
    text_button: string | null;
    link_id: number | null;
    order_num: number;
    section_id: number;
    input_type: InputType | null;
    link: LinkEntity | null;
    icon: Icon | null;
    icon_type: IconType | null;
    additional_info_list: AdditionalInfo[] | null;
}

export const mapSectionItemEntityToSectionItem = (entity: SectionItemEntity): SectionItem => ({
    id: entity.id_section_item,
    title: entity.title,
    subtitle: entity.subtitle,
    description: entity.description,
    image: entity.image,
    backgroundImage: entity.background_image,
    iconUrl: entity.icon_url,
    textButton: entity.text_button,
    linkId: entity.link_id ? Number(entity.link_id) : null,
    order: entity.order_num,
    sectionId: Number(entity.section_id),
    inputType: entity.input_type,
    link: entity.link ? mapLinkEntityToLink(entity.link) : null,
    icon: entity.icon,
    iconType: entity.icon_type,
    additionalInfoList: entity.additional_info_list
});
