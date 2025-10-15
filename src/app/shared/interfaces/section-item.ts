import { InputType } from '../mappers/section-item.mapper';

export interface SectionItem {
    id: number;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    backgroundImage: string | null;
    icon: string | null;
    textButton: string | null;
    linkId: number | null;
    order: number;
    sectionId: number;
    categoryId: number | null;
    inputType: InputType | null;
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

type InputTypeOption = {
    label: string;
    value: InputType;
};

export const imageTypeOptions: Record<ImageType, ImageTypeOption> = {
    NONE: { label: 'Ninguna', value: ImageType.NONE },
    LOCAL: { label: 'Subir imagen', value: ImageType.LOCAL },
    URL: { label: 'Usar URL', value: ImageType.URL }
};

export const inputTypeOptions: Record<InputType, InputTypeOption> = {
    TEXT: { label: 'Texto', value: InputType.TEXT },
    EMAIL: { label: 'Correo Electrónico', value: InputType.EMAIL },
    TEXTAREA: { label: 'Área de Texto', value: InputType.TEXTAREA }
};
