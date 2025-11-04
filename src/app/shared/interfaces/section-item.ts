import { AdditionalInfo, type Icon, IconType, InputType } from '../mappers/section-item.mapper';
import type { Link } from './link';

export interface SectionItem {
    id: number;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    backgroundImage: string | null;
    iconUrl: string | null;
    textButton: string | null;
    linkId: number | null;
    order: number;
    sectionId: number;
    inputType: InputType | null;
    link?: Link | null;
    icon: Icon | null;
    iconType: IconType | null;
    additionalInfoList: AdditionalInfo[] | null;
}

export enum ImageType {
    NONE = 'NONE',
    LOCAL = 'LOCAL',
    URL = 'URL'
}



type ImageTypeOption = {
    label: string;
    value: ImageType;
};

type IconTypeOption = {
    label: string;
    value: IconType;
};

type InputTypeOption = {
    label: string;
    value: InputType;
};



export const imageTypeOptions: Record<ImageType, ImageTypeOption> = {
    NONE: { label: 'Ninguna', value: ImageType.NONE },
    LOCAL: { label: 'Subir imagen', value: ImageType.LOCAL },
    URL: { label: 'Usar URL', value: ImageType.URL }
};

export const iconTypeOptions: Record<IconType, IconTypeOption> = {
    LIBRARY: { label: 'Biblioteca', value: IconType.LIBRARY },
    IMAGE: { label: 'Imagen', value: IconType.IMAGE }
};

export const inputTypeOptions: Record<InputType, InputTypeOption> = {
    TEXT: { label: 'Texto', value: InputType.TEXT },
    EMAIL: { label: 'Correo Electrónico', value: InputType.EMAIL },
    TEXTAREA: { label: 'Área de Texto', value: InputType.TEXTAREA }
};
